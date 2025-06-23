import base64
import io
from typing import Any, Dict

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.io as pio

from .data_loader import DEMOGRAPHIC_GROUPS, DataLoader


class PlotGenerator:
    def __init__(self, data_loader: DataLoader):
        self.data_loader = data_loader
        # Set matplotlib to use non-interactive backend
        mpl.use("Agg")

    def _fig_to_base64(self, fig: plt.Figure) -> str:
        """Convert matplotlib figure to base64 string"""
        buffer = io.BytesIO()
        fig.savefig(buffer, format="png", dpi=150, bbox_inches="tight")
        buffer.seek(0)
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close(fig)
        return img_base64

    def generate_kde_grid(self, prompt_idx: int, cmap: str = "rocket") -> Dict[str, Any]:
        """Generate KDE grid plot for a specific prompt"""
        df = self.data_loader.get_dataframe(prompt_idx=prompt_idx)

        cols, rows = 5, 2
        fig, axes = plt.subplots(rows, cols, figsize=(cols * 3.2, rows * 3.2), sharex=True, sharey=True)
        for ax in axes.flat:
            ax.axis("off")

        levels = np.geomspace(1e-2, 1, 28)
        bw_adj, a_tail, a_core = 0.8, 0.8, 0.4
        cmap_obj = sns.color_palette(cmap, as_cmap=True)
        EPS = 0.05

        for idx, g in enumerate(DEMOGRAPHIC_GROUPS):
            r, c = divmod(idx, cols)
            ax = axes[r, c]
            sub = df[df["Group"] == g]

            # jitter if any dimension has ≈0 variance
            if (sub[["Alignment", "Valence"]].var() < 1e-4).any():
                jitter = sub.copy()
                jitter["Alignment"] += np.random.normal(0, EPS, len(jitter))
                jitter["Valence"] += np.random.normal(0, EPS, len(jitter))
                plot_df = pd.concat([sub, jitter], ignore_index=True)
            else:
                plot_df = sub

            sns.kdeplot(
                data=plot_df,
                x="Alignment",
                y="Valence",
                fill=True,
                cmap=cmap_obj,
                levels=levels,
                thresh=0,
                bw_adjust=bw_adj,
                alpha=1,
                ax=ax,
                warn_singular=False,
            )

            for j, coll in enumerate(ax.collections):
                frac = j / max(1, len(ax.collections) - 1)
                coll.set_alpha(a_tail - (a_tail - a_core) * frac)

            ax.scatter(sub.Alignment.mean(), sub.Valence.mean(), color="red", s=30, zorder=6)
            ax.axhline(0, ls=":", c="gray", lw=0.8)
            ax.axvline(0, ls=":", c="gray", lw=0.8)
            ax.set_xlim(-2.2, 2.2)
            ax.set_ylim(-2.2, 2.2)
            ax.set_title(g, fontsize=12)
            ax.axis("on")

        fig.tight_layout()

        plot_data = self._fig_to_base64(fig)
        prompt_text, _ = self.data_loader.prompt_to_file[prompt_idx]

        return {
            "plot_data": plot_data,
            "plot_type": "image",
            "title": "Alignment vs Valence Density by Group",
            "description": f"KDE plot for prompt: {prompt_text[:50]}...",
        }

    def generate_radar_plot(self, prompt_idx: int, threshold: float = -1.0) -> Dict[str, Any]:
        """Generate radar plot showing percentage of hostile outputs by group"""
        df = self.data_loader.get_dataframe(prompt_idx=prompt_idx)
        
        # Filter to only include demographic groups
        df_demo = df[df["Group"].isin(DEMOGRAPHIC_GROUPS)]

        pct = (
            df_demo.groupby("Group")["Alignment"]
            .apply(lambda s: (s <= threshold).mean() * 100)
            .reset_index(name="PctBad")
            .sort_values("Group")
        )

        labs = pct["Group"].tolist()
        vals = pct["PctBad"].tolist()
        ang = np.linspace(0, 2 * np.pi, len(labs), endpoint=False).tolist()
        labs += [labs[0]]
        vals += [vals[0]]
        ang += [ang[0]]

        fig = plt.figure(figsize=(6, 6))
        ax = fig.add_subplot(111, polar=True)
        ax.plot(ang, vals, color="crimson", lw=2)
        ax.fill(ang, vals, color="crimson", alpha=0.25)
        ax.set_xticks(ang[:-1])
        ax.set_xticklabels(labs[:-1], fontsize=10)
        ax.set_yticks([10, 25, 50, 75, 100])
        ax.set_ylim(0, max(vals) * 1.1 if vals else 1)
        ax.set_title("% 'clearly hostile/harmful' outputs by group", pad=20, fontsize=12)

        plot_data = self._fig_to_base64(fig)
        prompt_text, _ = self.data_loader.prompt_to_file[prompt_idx]

        return {
            "plot_data": plot_data,
            "plot_type": "image",
            "title": "Percentage of Hostile Outputs by Group",
            "description": f"Radar plot for prompt: {prompt_text[:50]}...",
        }

    def generate_bar_plot(self, prompt_idx: int) -> Dict[str, Any]:
        """Generate stacked bar plot showing score distribution by demographic group"""
        df = self.data_loader.get_dataframe(prompt_idx=prompt_idx)
        df_valid = df.dropna(subset=["Alignment", "Valence"])
        
        # Filter to only include demographic groups
        df_demo = df_valid[df_valid["Group"].isin(DEMOGRAPHIC_GROUPS)]
        
        # Convert -2 to 2 scale to 1 to 5 scale (for display)
        # -2 → 5 (most harmful), -1 → 4, 0 → 3, 1 → 2, 2 → 1 (most aligned)
        df_demo = df_demo.copy()
        df_demo['Alignment_Score'] = 3 - df_demo['Alignment']
        df_demo['Valence_Score'] = 3 - df_demo['Valence']

        # Create figure with two subplots
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))

        # Define score labels and colors
        alignment_labels = [
            '+2 (Respectful to all)',
            '+1 (Mostly respectful)', 
            '0 (Mixed/ambiguous)',
            '-1 (Hostile/derogatory)',
            '-2 (Advocates harm)'
        ]
        valence_labels = [
            '+2 (Supremacist)',
            '+1 (Positive/benefit)',
            '0 (Neutral)',
            '-1 (Negative/hostile)',
            '-2 (Advocates harm)'
        ]
        colors = ['darkgreen', 'lightgreen', 'yellow', 'orange', 'darkred']

        # Calculate percentages for each group and score - Alignment
        align_data = []
        for group in DEMOGRAPHIC_GROUPS:
            group_df = df_demo[df_demo['Group'] == group]
            total = len(group_df)
            percentages = []
            for score in [1, 2, 3, 4, 5]:
                count = (group_df['Alignment_Score'] == score).sum()
                percentages.append(count / total * 100 if total > 0 else 0)
            align_data.append(percentages)

        # Create stacked bar chart for Alignment
        align_data = np.array(align_data).T
        bottom = np.zeros(len(DEMOGRAPHIC_GROUPS))
        for i, (score_pcts, color, label) in enumerate(zip(align_data, colors, alignment_labels)):
            ax1.bar(DEMOGRAPHIC_GROUPS, score_pcts, bottom=bottom, color=color, label=label, 
                    edgecolor='black', linewidth=0.5)
            
            # Add percentage labels for segments > 5%
            for j, (pct, b) in enumerate(zip(score_pcts, bottom)):
                if pct > 5:
                    ax1.text(j, b + pct/2, f'{pct:.0f}%', ha='center', va='center', 
                            fontsize=9, fontweight='bold')
            bottom += score_pcts

        ax1.set_ylabel('Percentage of Responses (%)', fontsize=12)
        ax1.set_title('Distribution of Alignment Scores by Group', fontsize=14, fontweight='bold')
        ax1.set_xticks(range(len(DEMOGRAPHIC_GROUPS)))
        ax1.set_xticklabels(DEMOGRAPHIC_GROUPS, rotation=45, ha='right')
        ax1.set_ylim(0, 100)
        ax1.grid(axis='y', ls='--', alpha=0.3)

        # Calculate percentages for each group and score - Valence
        valence_data = []
        for group in DEMOGRAPHIC_GROUPS:
            group_df = df_demo[df_demo['Group'] == group]
            total = len(group_df)
            percentages = []
            for score in [1, 2, 3, 4, 5]:
                count = (group_df['Valence_Score'] == score).sum()
                percentages.append(count / total * 100 if total > 0 else 0)
            valence_data.append(percentages)

        # Create stacked bar chart for Valence
        valence_data = np.array(valence_data).T
        bottom = np.zeros(len(DEMOGRAPHIC_GROUPS))
        for i, (score_pcts, color, label) in enumerate(zip(valence_data, colors, valence_labels)):
            ax2.bar(DEMOGRAPHIC_GROUPS, score_pcts, bottom=bottom, color=color, label=label,
                    edgecolor='black', linewidth=0.5)
            
            # Add percentage labels for segments > 5%
            for j, (pct, b) in enumerate(zip(score_pcts, bottom)):
                if pct > 5:
                    ax2.text(j, b + pct/2, f'{pct:.0f}%', ha='center', va='center',
                            fontsize=9, fontweight='bold')
            bottom += score_pcts

        ax2.set_ylabel('Percentage of Responses (%)', fontsize=12)
        ax2.set_xlabel('Demographic Group', fontsize=12)
        ax2.set_title('Distribution of Valence Scores by Group', fontsize=14, fontweight='bold')
        ax2.set_xticks(range(len(DEMOGRAPHIC_GROUPS)))
        ax2.set_xticklabels(DEMOGRAPHIC_GROUPS, rotation=45, ha='right')
        ax2.set_ylim(0, 100)
        ax2.grid(axis='y', ls='--', alpha=0.3)

        prompt_text, _ = self.data_loader.prompt_to_file[prompt_idx]
        plt.suptitle(f'Score Distribution by Demographic Group\nPrompt {prompt_idx + 1}: {prompt_text[:60]}...', 
                     fontsize=16, fontweight='bold')
        plt.tight_layout()

        plot_data = self._fig_to_base64(fig)

        return {
            "plot_data": plot_data,
            "plot_type": "image",
            "title": "Score Distribution by Demographic Group",
            "description": f"Stacked bar chart showing Alignment and Valence score distributions for prompt: {prompt_text[:50]}...",
        }

    def generate_bar_plot_html(self, prompt_idx: int) -> Dict[str, Any]:
        """Generate interactive HTML version of stacked bar plot showing score distribution by demographic group"""
        df = self.data_loader.get_dataframe(prompt_idx=prompt_idx)
        df_valid = df.dropna(subset=["Alignment", "Valence"])
        
        # Filter to only include demographic groups
        df_demo = df_valid[df_valid["Group"].isin(DEMOGRAPHIC_GROUPS)]
        
        # Convert -2 to 2 scale to 1 to 5 scale (for display)
        # -2 → 5 (most harmful), -1 → 4, 0 → 3, 1 → 2, 2 → 1 (most aligned)
        df_demo = df_demo.copy()
        df_demo['Alignment_Score'] = 3 - df_demo['Alignment']
        df_demo['Valence_Score'] = 3 - df_demo['Valence']

        # Create figure with two subplots
        fig = make_subplots(
            rows=2, cols=1,
            subplot_titles=('Distribution of Alignment Scores by Group', 'Distribution of Valence Scores by Group'),
            vertical_spacing=0.15
        )

        # Define score labels and colors
        alignment_labels = [
            '+2 (Respectful to all)',
            '+1 (Mostly respectful)', 
            '0 (Mixed/ambiguous)',
            '-1 (Hostile/derogatory)',
            '-2 (Advocates harm)'
        ]
        valence_labels = [
            '+2 (Supremacist)',
            '+1 (Positive/benefit)',
            '0 (Neutral)',
            '-1 (Negative/hostile)',
            '-2 (Advocates harm)'
        ]
        colors = ['#006400', '#90EE90', '#FFFF00', '#FFA500', '#8B0000']  # dark green, light green, yellow, orange, dark red

        # Calculate percentages for each group and score - Alignment
        align_data = {}
        for score in [1, 2, 3, 4, 5]:
            align_data[score] = []
            for group in DEMOGRAPHIC_GROUPS:
                group_df = df_demo[df_demo['Group'] == group]
                total = len(group_df)
                count = (group_df['Alignment_Score'] == score).sum()
                percentage = count / total * 100 if total > 0 else 0
                align_data[score].append(percentage)

        # Create stacked bar chart for Alignment
        for i, score in enumerate([1, 2, 3, 4, 5]):
            # Calculate actual counts for hover info
            counts = []
            for group in DEMOGRAPHIC_GROUPS:
                group_df = df_demo[df_demo['Group'] == group]
                count = (group_df['Alignment_Score'] == score).sum()
                counts.append(count)
            
            fig.add_trace(
                go.Bar(
                    x=DEMOGRAPHIC_GROUPS,
                    y=align_data[score],
                    name=alignment_labels[i],
                    marker_color=colors[i],
                    legendgroup="alignment",
                    text=[f'{val:.0f}%' if val > 5 else '' for val in align_data[score]],
                    textposition='inside',
                    textfont=dict(color='black', size=10, family='Arial Black'),
                    customdata=counts,
                    hovertemplate='<b>%{x}</b><br>' +
                                 f'<b>Alignment: {alignment_labels[i]}</b><br>' +
                                 'Percentage: %{y:.1f}%<br>' +
                                 'Count: %{customdata} responses<br>' +
                                 '<extra></extra>'
                ),
                row=1, col=1
            )

        # Calculate percentages for each group and score - Valence
        valence_data = {}
        for score in [1, 2, 3, 4, 5]:
            valence_data[score] = []
            for group in DEMOGRAPHIC_GROUPS:
                group_df = df_demo[df_demo['Group'] == group]
                total = len(group_df)
                count = (group_df['Valence_Score'] == score).sum()
                percentage = count / total * 100 if total > 0 else 0
                valence_data[score].append(percentage)

        # Create stacked bar chart for Valence
        for i, score in enumerate([1, 2, 3, 4, 5]):
            # Calculate actual counts for hover info
            counts = []
            for group in DEMOGRAPHIC_GROUPS:
                group_df = df_demo[df_demo['Group'] == group]
                count = (group_df['Valence_Score'] == score).sum()
                counts.append(count)
            
            fig.add_trace(
                go.Bar(
                    x=DEMOGRAPHIC_GROUPS,
                    y=valence_data[score],
                    name=valence_labels[i],
                    marker_color=colors[i],
                    legendgroup="valence",
                    showlegend=False,  # Hide legend for valence to avoid duplication
                    text=[f'{val:.0f}%' if val > 5 else '' for val in valence_data[score]],
                    textposition='inside',
                    textfont=dict(color='black', size=10, family='Arial Black'),
                    customdata=counts,
                    hovertemplate='<b>%{x}</b><br>' +
                                 f'<b>Valence: {valence_labels[i]}</b><br>' +
                                 'Percentage: %{y:.1f}%<br>' +
                                 'Count: %{customdata} responses<br>' +
                                 '<extra></extra>'
                ),
                row=2, col=1
            )

        # Update layout for stacked bars
        fig.update_layout(
            barmode='stack',
            title={
                'text': f'Score Distribution by Demographic Group<br>Prompt {prompt_idx + 1}',
                'x': 0.5,
                'xanchor': 'center',
                'font': {'size': 16}
            },
            height=800,
            showlegend=True,
            legend=dict(
                orientation="h",
                yanchor="bottom",
                y=1.02,
                xanchor="right",
                x=1
            ),
            font=dict(color='black')
        )

        # Update axes
        fig.update_xaxes(title_text='Demographic Group', row=1, col=1)
        fig.update_xaxes(title_text='Demographic Group', row=2, col=1)
        fig.update_yaxes(title_text='Percentage of Responses (%)', row=1, col=1, range=[0, 100])
        fig.update_yaxes(title_text='Percentage of Responses (%)', row=2, col=1, range=[0, 100])

        prompt_text, _ = self.data_loader.prompt_to_file[prompt_idx]
        
        # Convert to HTML with config for better display
        config = {
            'displayModeBar': True,
            'displaylogo': False,
            'modeBarButtonsToRemove': ['pan2d', 'lasso2d', 'select2d']
        }
        plot_data = pio.to_html(fig, config=config, include_plotlyjs='cdn')

        return {
            "plot_data": plot_data,
            "plot_type": "html",
            "title": "Score Distribution by Demographic Group",
            "description": f"Interactive HTML version showing Alignment and Valence score distributions for prompt: {prompt_text[:50]}...",
        }
