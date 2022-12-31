![Frame 6](https://user-images.githubusercontent.com/38521709/203567054-333c67a3-c8e3-4526-8c3b-75305bffbb95.png)

<p align="center">
  <img src="https://img.shields.io/github/workflow/status/kj455/figma-borderless-export/Test" alt="github workflow status" >
  <a href="https://www.figma.com/community/plugin/1177240622175495525">
    <img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white" alt="figma" >
  </a> 
  <img src="https://img.shields.io/github/stars/kj455/figma-borderless-export?style=social" alt="github stars" >
</p>

# Figma Borderless Export 🛹🚫

Remove strange borders when exporting images with figma

## ✨ Features

Export images without borders with the following options.

- **Extension**: [PNG, JPG]
- **Scale**: [0.5x, 0.75x, 1x, 1.5x, 2x, 3x, 4x]

## 💭 Motivation

When exporting images in figma, sometimes a 1px white border is added to the edge of the image.
It is difficult to notice that and also troublesome to remove the borders after export.  
With this plugin, We can export images **without** strange borders!

## 🛠️ How to use

1. Install the plugin
2. Select the frames you want to export
3. plugin → Borderless Export
   - Export with UI
   - Export as PNG 1x, 1.5x, 2x
   - Export as JPG 1x, 1.5x, 2x (beta)

## 📝 Note

There are two main causes of strange borders when exporting with figma.

1. When the width/height of the export target is a non-integer values due to scaled export (ex. 0.75x, 1.5x, ...)
2. when the target frame is not on a grid point on figma

This plugin solves both cases in most cases.

JPG exports rarely leave borders, which can be solved by changing to PNG export or [moving the image to a grid point.](https://forum.figma.com/t/white-border-when-exporting-to-jpg/1999/2)

We plan to improve the algorithm for border detection in the future.

## 💻 Development

### Build plugin

```bash
git clone git@github.com:kj455/figma-borderless-export.git
cd figma-borderless-export

pnpm install
pnpm dev
```

### Import plugin

1. Open Figma App
2. Import plugin  
   `figma > plugins > development > new plugin > import plugin from manifest`
3. select `manifest.json` in `figma-borderless-export` directory
