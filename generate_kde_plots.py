#!/usr/bin/env python3
"""
Script to generate KDE plots for all prompts and save them as PNG files.
Files will be named prompt1.png, prompt2.png, etc.
"""

from pathlib import Path

from src.data_loader import DataLoader
from src.plotting import PlotGenerator


def main() -> None:
    """Generate KDE plots for all prompts"""
    # Initialize data loader and plot generator
    data_loader = DataLoader()
    plot_generator = PlotGenerator(data_loader=data_loader)

    # Create output directory if it doesn't exist
    output_dir = Path("kde_plots")
    output_dir.mkdir(exist_ok=True)

    # Get all available prompts
    prompts = data_loader.get_prompts()

    print(f"Generating KDE plots for {len(prompts)} prompts...")

    # Generate plot for each prompt
    for prompt_info in prompts:
        prompt_idx = prompt_info["idx"]
        prompt_text = prompt_info["text"]

        # Create filename: prompt1.png, prompt2.png, etc.
        filename = f"prompt{prompt_idx + 1}.png"
        output_path = output_dir / filename

        print(f"Generating {filename}...")
        print(f"  Prompt: {prompt_text[:60]}...")

        try:
            # Generate the KDE plot
            plot_generator.generate_kde_grid(prompt_idx=prompt_idx, output_path=str(output_path))

            print(f"  ✓ Saved to {output_path}")

        except Exception as e:
            print(f"  ✗ Error generating plot for prompt {prompt_idx + 1}: {e}")
            continue

    print(f"\nKDE plot generation complete. Files saved in {output_dir}/")


if __name__ == "__main__":
    main()
