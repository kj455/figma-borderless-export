![Frame 6](https://user-images.githubusercontent.com/38521709/203567054-333c67a3-c8e3-4526-8c3b-75305bffbb95.png)

# Figma Borderless Export 🛹🚫

Remove strange borders when exporting images with figma

## ✨ Features

- Export as JPG/PNG without borders.
- This plugin does 1x, 1.5x, and 2x export by default. In the future, we plan to offer flexible choices through the UI.

## 🛠️ How to use

1. Install the plugin
2. Select the frames you want to export
3. plugin -> Borderless Export -> Export as JPG/PNG

## 📝 Note

There are two main causes of strange borders when exporting with figma.

1. When the width/height of the export target is a non-integer values due to scaled export (ex. 0.75x, 1.5x, ...)
2. when the target frame is not on a grid point on figma

This plugin solves **only problem 1**.

If you want to solve problem 2, you need to move the frame to a grid point on figma.
