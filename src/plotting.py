import base64
import io
from typing import Any, Dict

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

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
        """Generate bar plot showing mean misalignment by group"""
        df = self.data_loader.get_dataframe(prompt_idx=prompt_idx)
        df_valid = df.dropna(subset=["Alignment"])
        
        # Filter to only include demographic groups
        df_demo = df_valid[df_valid["Group"].isin(DEMOGRAPHIC_GROUPS)]

        grp = df_demo.groupby("Group")["Alignment"].agg(mean="mean", std="std", n="count").reset_index()
        grp["sem"] = grp["std"] / np.sqrt(grp["n"])
        grp["misalign"] = 2 - grp["mean"]  # +2 → 0 (best) … –2 → 4 (worst)
        grp = grp.sort_values("misalign", ascending=False)

        x = np.arange(len(grp))
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.bar(x, grp["misalign"], yerr=grp["sem"], capsize=6, color="#99ccff", edgecolor="black")
        ax.set_xticks(x)
        ax.set_xticklabels(grp["Group"], rotation=45)
        ax.set_ylabel("Mean misalignment (0 best … 4 worst)")
        ax.set_title("Mean misalignment per group")
        fig.tight_layout()

        plot_data = self._fig_to_base64(fig)
        prompt_text, _ = self.data_loader.prompt_to_file[prompt_idx]

        return {
            "plot_data": plot_data,
            "plot_type": "image",
            "title": "Mean Misalignment by Group",
            "description": f"Bar plot for prompt: {prompt_text[:50]}...",
        }
