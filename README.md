# CountryVote - Frontend

A React + TypeScript application that allows users to vote for their favorite countries and view the top 10 most voted countries with real-time updates.

## Features

- **Voting Form**: Submit your name, email, and favorite country
  - Real-time validation on blur
  - Email format validation with visual feedback
  - One vote per email address (409 conflict handling)
  - Searchable country dropdown with filtering
  - Custom toast notifications for success/error feedback
  
- **Country Display Table**: View top 10 countries sorted by votes
  - Real-time search and filtering by country name, capital, region, sub-region, and vote count
  - Skeleton loaders for loading states
  - Responsive design with custom table styling
  - Auto-refresh after successful vote submission

## Tech Stack

- **React 19.2.0**: UI library with hooks (useState, useEffect, useReducer, useRef)
- **TypeScript**: Strict type safety
- **Vite 7.2.4**: Build tool and dev server
- **Tailwind CSS v4**: Utility-first CSS framework with custom theme
- **Custom Hooks**: Business logic abstraction (useCountries, useVoteForm, useToast)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone git@github.com:tapas2000/country_vote.git
cd country_vote
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - The app runs on port 4000 by default (configured in `.env`)
   - Backend API should be running on `http://localhost:3000`
   ```
   VITE_PORT=4000
   VITE_API_URL=http://localhost:3000/api
   ```

4. Ensure backend service is running:
   - Clone and run the backend: [country_vote_service](https://github.com/tapas2000/country_vote_service)

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:4000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Project Structure

```
src/
├── components/           # Shared reusable components
│   ├── Header.tsx       # Application header
│   ├── Input.tsx        # Reusable input with validation
│   ├── SearchInput.tsx  # Search input with icon
│   ├── SkeletonLoader.tsx # Loading state component
│   └── Toast.tsx        # Toast notification component
├── constants/           # Application constants
│   ├── strings.ts      # All UI text centralized
│   └── toast.ts        # Toast action constants
├── hooks/              # Shared custom hooks
│   └── useToast.ts     # Toast notification management
├── layouts/            # Feature-based layout organization
│   └── vote/
│       ├── components/ # Vote-specific components
│       ├── hooks/      # Vote-specific hooks
│       └── index.tsx   # Vote layout orchestrator
├── services/           # API communication layer
│   ├── countryService.ts # Country-related API calls
│   └── voteService.ts    # Vote submission
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets (images, icons)
```

For detailed architecture information, see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)

## Design Choices

### Architecture
- **Layered Architecture**: Clear separation of concerns (presentation, business logic, data, utilities)
- **Feature-Based Organization**: Vote feature organized in layouts/vote with its own components, hooks, and logic
- **State management**: Mix of useState, useReducer (for complex state), and custom hooks
- **Type Safety**: Strict TypeScript throughout the application
- **Styling approach**: Tailwind CSS v4 with custom theme variables

### Form Validation
- Real-time validation on blur events
- Email regex validation with visual feedback (red border, warning icon)
- Input padding adjusts to prevent text overlap with error icon
- Submit button disabled when form has errors
- Error messages displayed inline for better UX

### Search Functionality
- Real-time filtering by country name, capital, region, sub-region, and vote count
- Filter logic handled in service layer
- Searches across multiple fields simultaneously
- No API calls for filtering (client-side performance)

### Toast Notifications
- Custom implementation using useReducer
- Success and error states with different styling
- Auto-dismiss after 3 seconds
- Smooth slideDown animation

### Responsive Design
- Mobile-first approach using Tailwind's responsive utilities
- Custom scrollbar styling (webkit and Firefox support)
- Table with optimized column widths
- Grid layout adapts to screen size

## API Integration

The frontend communicates with the backend service through a service layer abstraction.

Backend Repository: [country_vote_service](https://github.com/tapas2000/country_vote_service)

### Endpoints

**POST `/api/votes`** - Submit a new vote
```typescript
Request:
{
  name: string;
  email: string;
  country: string; // Country code (cca2 or cca3)
}

Response:
{
  success: boolean;
  message?: string;
  errors?: ValidationErrors;
}
```

**GET `/api/countries/top?limit=10`** - Get top voted countries
```typescript
Response:
{
  data: Country[];
}

interface Country {
  name: string;
  capital: string | string[];
  region: string;
  subRegion: string;
  votes: number;
  cca2?: string;
  cca3?: string;
}
```

**GET `/api/countries/all?limit=250`** - Get all countries for dropdown

### Service Layer
- **countryService.ts**: Handles country-related API calls with mock data fallback
- **voteService.ts**: Handles vote submission with error handling
- All services return `ServiceResponse<T>` type for consistency

## Implemented Features ✅

- ✅ Full TypeScript implementation with strict mode
- ✅ Layered architecture with feature-based organization
- ✅ Custom toast notifications using useReducer
- ✅ Real-time form validation with visual feedback
- ✅ Searchable country dropdown with filtering
- ✅ Skeleton loaders for loading states
- ✅ Auto-refresh after successful vote submission
- ✅ Search by vote count
- ✅ Custom scrollbar styling
- ✅ Reusable components (Input, Toast, SkeletonLoader)
- ✅ Constants centralization for maintainability
- ✅ Service layer abstraction for API calls
- ✅ Error handling with user-friendly messages

## Future Enhancements 🚀

- [ ] Add flag icons for countries
- [ ] Implement pagination for country table
- [ ] Add sorting by different columns (clickable headers)
- [ ] User authentication for tracking votes
- [ ] Add charts/visualizations for vote statistics
- [ ] Implement debouncing for search input
- [ ] Add unit and integration tests (Jest, React Testing Library)
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Dark mode support
- [ ] Real-time updates with WebSockets
- [ ] Export data functionality (CSV, JSON)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Related Repositories

- **Backend Service**: [country_vote_service](https://github.com/tapas2000/country_vote_service)
- **Frontend**: [country_vote](https://github.com/tapas2000/country_vote)

## Documentation

- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Detailed architecture and design decisions

## Author

**tapas2000** (felipe-08011@hotmail.com)

## License

MIT
