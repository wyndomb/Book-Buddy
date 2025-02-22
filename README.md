# Book Buddy - Your AI Reading Companion

Book Buddy is a mobile web application that helps you understand text from physical books using AI. Simply take a picture of the text, and Book Buddy will provide a clear, simple explanation along with key concepts and examples.

## Features

- 📸 Camera integration for capturing text from books
- 📝 OCR text extraction
- 🤖 AI-powered text analysis and explanation
- 📱 Mobile-first, responsive design
- 🌐 Progressive Web App (PWA) support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd book-buddy
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your mobile browser

## Usage

1. Open Book Buddy on your mobile device
2. Click the "Take Picture" button
3. Allow camera access when prompted
4. Point your camera at the text you want to analyze
5. Take the picture
6. Wait for the OCR and AI analysis
7. Read the simplified explanation and insights

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- DaisyUI
- Tesseract.js for OCR
- OpenAI API for text analysis
- React Webcam
- PWA support

## Development

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
