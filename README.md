# Capture The Second - Online Photo Booth

A modern, interactive web-based photo booth application built with React that allows users to take photos, apply filters, customize themes, and create memorable photo strips.

![Photo Booth Logo](./src/public/Icon.png)

## 🌟 Features

- **Live Camera Preview**: Real-time camera feed with countdown timer
- **Multi-Photo Capture**: Takes a series of 3 photos with countdown
- **Customization Options**:
  - Background color selection
  - Image filters (grayscale, sepia, etc.)
  - Custom message with color picker
  - Decorative themes
- **Photo Strip Generation**: Creates a styled photo strip with:
  - Date stamp
  - Frame numbers
  - Custom message
  - Theme decorations
- **Responsive Design**: Works on both desktop and mobile devices
- **Download Capability**: Save photo strips as JPEG images

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with camera access

### Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

## 📸 How to Use

1. **Grant Camera Access**

   - Allow camera permissions when prompted by your browser
   - If denied, refresh the page to request permissions again

2. **Take Photos**

   - Click the camera button to start
   - Wait for the 3-second countdown between each photo
   - The app will take 3 photos automatically

3. **Customize Your Photo Strip**

   - Choose a background color
   - Apply image filters
   - Add a custom message
   - Select a theme with decorations

4. **Save Your Creation**
   - Click the download button to save your photo strip
   - Images are saved in JPEG format
   - Use the retake button to start over

## 🛠️ Technical Stack

- React
- Framer Motion (animations)
- Tailwind CSS (styling)
- react-webcam (camera functionality)

## 📱 Responsive Design

The application features a responsive layout that adapts to different screen sizes:

- **Desktop**: Side-by-side layout with photo strip and controls
- **Mobile**: Vertical layout with photo strip on top and controls below

## 🔧 Components

- **PhotoBooth**: Main component orchestrating the application
- **CameraView**: Handles camera feed and capture interface
- **PhotoStrip**: Renders the final photo strip layout
- **Colors**: Background color selection interface
- **Filters**: Image filter selection interface
- **Themes**: Theme selection and decoration options
- **ActionButtons**: Control buttons for retake and download

## 🤝 Contributing & Usage

This repository represents the personal version of Capture The Second by Gito.dev. While direct modifications to this repository are not accepted, you are welcome to:

### ✅ What You Can Do

1. **Fork the Project**

   - Create your own version
   - Modify your fork however you like
   - Use it for personal or commercial projects
   - Experiment with new features

2. **Learn From It**

   - Study the code
   - Use it as a reference
   - Get inspired for your own projects

3. **Use the Application**
   - Deploy your own instance
   - Customize your forked version
   - Share it with others

### ⚠️ Please Note

- This specific repository is Gito.dev's personal version and will be maintained solely by Gito.dev
- For your modifications, please fork the repository and work on your own copy
- Remember to maintain the attribution to Gito.dev as the original developer in any forks or derivatives

## 📄 License

MIT License

Copyright (c) 2024 Gito.dev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and attribution to Gito.dev as the original developer
shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

## 📞 Support

For questions about this version, please contact [gitodevelopment@gmail.com].

---

Made with ❤️ by Gito.Dev
