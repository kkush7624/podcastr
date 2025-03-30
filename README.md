# Podcastr Application

![image](https://github.com/user-attachments/assets/8f7264e0-cee9-4318-a203-390baf1ecffc)

![image](https://github.com/user-attachments/assets/cfedc6a4-58af-4b90-b990-3e3a869b1b2b)

[Podcastr Live Website (https://podcastr-green.vercel.app)](https://podcastr-green.vercel.app/)

Welcome to Podcastr, an AI-powered Software-as-a-Service (SaaS) application designed to revolutionize podcast creation and management. This application leverages cutting-edge AI technologies to provide features such as text-to-multiple-voices functionality and AI-generated images, all built using Next.js 14 and Convex.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
4. [Usage](#usage)
    - [Text-to-Voice](#text-to-voice)
    - [AI-Generated Images](#ai-generated-images)
5. [Configuration](#configuration)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)

## Introduction

Podcastr is designed for podcast creators who want to enhance their production quality with AI. By providing a platform where text can be converted into multiple voices and custom images can be generated for each episode, Podcastr simplifies the process of creating professional-grade podcasts.

## Features

- **Text-to-Multiple-Voices Functionality**: Convert written content into speech using a variety of AI-generated voices, giving each character or segment a unique sound.
- **AI-Generated Images**: Automatically generate custom images for podcast episodes, improving visual appeal and audience engagement by just providing a suitable prompt according to your choice.
- **Built with Next.js 14**: Leveraging the latest features of Next.js for optimal performance and scalability.
- **Powered by Convex**: Utilizing Convex for efficient and secure data management and AI model integration.
- **Podcast Discovery**: Users can explore a wide variety of podcasts from different genres.
- **Create Podcasts**: Registered users can create, edit, and upload their podcasts.
- **Podcast Playback**: Seamless integration with audio players for an engaging listening experience.
- **User Authentication**: Sign up and log in functionality to manage podcasts. One can also conveniently login used other social sites like Google and GitHub.
- **Responsive Design**: Optimized for both desktop and mobile experiences.
- **Finding right Podcast**: Users can search for podcasts according to their areas of interests.
## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Clerk for user authentication
- **Hosting**: Vercel for frontend deployment, Convex for backend storage and API management

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v16.0.0 or later)
- npm or yarn
- Git

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/podcastr.git
    cd podcastr
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3. **Set up environment variables**:
    Create a `.env.local` file in the root directory and add your configuration settings (API keys, database URLs, etc.).

    Example:
    ```env
    NEXT_PUBLIC_API_KEY=yourapikey
    CONVEX_API_URL=https://yourconvexinstance.com
    ```

4. **Run the development server**:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Project Structure

```bash
.
├── components       # Reusable components (e.g., PodcastCard, Layout, etc.)
├── pages            # Application routes (Home, Discover, Create, etc.)
├── public           # Static assets (images, icons, etc.)
├── styles           # Tailwind CSS configuration and global styles
├── utils            # Utility functions and helpers
└── README.md        # Project documentation
```

## Usage

### Text-to-Voice

1. Navigate to the Text-to-Voice section in the application.
2. Enter your text into the provided input field.
3. Select the desired voices for different parts of the text.
4. Click `Generate` button to create the audio file.
5. Listen to or download the generated audio.

### AI-Generated Images

1. Go to the AI-Generated Images section.
2. Enter the description or keywords for the image you need.
3. Click `Generate Image` button to create a custom image for your podcast episode.
4. View and download the generated image.

## Configuration

Additional configuration options can be set in the `.env.local` file or within the application settings. Ensure you have all required API keys and service URLs configured properly.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a pull request.

Please ensure your code adheres to the existing code style and includes appropriate tests.
