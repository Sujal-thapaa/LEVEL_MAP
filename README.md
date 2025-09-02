# Level Map Game

A beautiful, interactive level map with 7 levels that redirect to individual HTML files.

## Features

- **7 Interactive Levels**: Each level button redirects to its corresponding HTML file
- **Zigzag Layout**: Levels are arranged in a visually appealing zigzag pattern
- **Progress Tracking**: Uses localStorage to track completed levels
- **Responsive Design**: Works on all device sizes
- **Beautiful Animations**: Smooth transitions and hover effects
- **Sound Effects**: Audio feedback for level completion and unlocking

## How It Works

1. **Main Level Map** (`index.html`): Shows all 7 levels in a zigzag pattern
2. **Individual Level Files**: Each level (level1.html through level7.html) contains the actual challenge
3. **Progress Persistence**: Completion status is stored in localStorage
4. **Navigation**: Each level has a "Back to Level Map" button

## File Structure

```
├── index.html              # Main level map
├── level1.html             # Level 1 challenge
├── level2.html             # Level 2 challenge
├── level3.html             # Level 3 challenge
├── level4.html             # Level 4 challenge
├── level5.html             # Level 5 challenge
├── level6.html             # Level 6 challenge
├── level7.html             # Level 7 challenge
├── src/                    # React source code
│   ├── components/
│   │   ├── LevelMap.tsx    # Main level map component
│   │   ├── LevelNode.tsx   # Individual level button component
│   │   ├── RailwayPath.tsx # Road/path between levels
│   │   └── ...
│   └── ...
└── README.md
```

## Customization

### Changing Level Positions

Edit the `levelData` array in `src/components/LevelMap.tsx`:

```typescript
const levelData = useMemo(() => [
  { id: 1, x: 15, y: 85, difficulty: 'Easy', stars: 1, description: '...' },
  { id: 2, x: 35, y: 75, difficulty: 'Easy', stars: 1, description: '...' },
  // ... adjust x and y values to change positions
], []);
```

### Modifying Road Appearance

Edit `src/components/RailwayPath.tsx`:

- **Road thickness**: Change `strokeWidth="4"`
- **Road color**: Change `stroke="white"`
- **Railway ties**: Modify the `Array.from({ length: 5 })` loop
- **Tie size**: Adjust `width` and `height` values

### Customizing Level Buttons

Edit `src/components/LevelNode.tsx`:

- **Button size**: Change `w-20 h-20` classes
- **Button shape**: Modify `rounded-full` class
- **Border thickness**: Adjust `border-4` class
- **Colors**: Edit the `getStatusStyles()` function

### Adding Content to Levels

Each level HTML file has a placeholder section:

```html
<div class="bg-white/20 rounded-2xl p-6 mb-8">
  <p class="text-lg">Your level content goes here!</p>
  <p class="text-sm text-blue-200 mt-2">This could be a game, quiz, or any interactive content.</p>
</div>
```

Replace this with your actual level content (games, puzzles, quizzes, etc.).

## Running the Project

1. **Development Mode**:
   ```bash
   npm install
   npm run dev
   ```

2. **Build for Production**:
   ```bash
   npm run build
   npm run preview
   ```

## Browser Compatibility

- Modern browsers with ES6+ support
- localStorage support required for progress tracking
- Responsive design works on mobile and desktop

## Adding More Levels

To add more levels:

1. Update the `levelData` array in `LevelMap.tsx`
2. Create corresponding `levelX.html` files
3. Update the progress bar total in `ProgressBar` component
4. Modify the completion logic in `handleNext` function

## License

This project is open source and available under the MIT License.
