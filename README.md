# Tasks Prototype

<img width="300" height="600" alt="Simulator Screenshot - iPhone 16 Pro Max - 2025-08-26 at 13 32 11" src="https://github.com/user-attachments/assets/ee8cfbe8-c1c9-42b1-9931-8f75f232b98d" />
<img width="300" height="600" alt="Simulator Screenshot - iPhone 16 Pro Max - 2025-08-26 at 13 32 15" src="https://github.com/user-attachments/assets/e1ef3bc8-5fc3-4ff4-8d26-fc9cae955f9f" />
<img width="300" height="600" alt="Simulator Screenshot - iPhone 16 Pro Max - 2025-08-26 at 13 32 17" src="https://github.com/user-attachments/assets/f7d00832-8292-4b4f-8d24-3439385d2327" />

https://github.com/user-attachments/assets/668b9cf4-6ff2-4355-b640-265f0d3e7e6f

Development Process video: https://www.youtube.com/watch?v=jSDNzGXVtsE

A mobile tasks prototype built with Expo Router and React Native. It focuses on a clean information hierarchy and fluid interactions:

- Five bottom tabs (Home, My Work, Add Task, Insights, Profile)
- Home includes a greeting header and a Material Top Tab Navigator (Tasks, Reminders, Meetings, Notes)
- A Tasks feature with creation modal, animated list, filtering, undo toast, and persistent storage

This document explains the architecture, important dependencies, and the core logic implemented.

## Live Demo
https://joaopauloubaf.github.io/tasks-prototype/

Time report: https://wakatime.com/@4bfee3d0-b953-472e-b3d4-00685405a4c9/projects/oldlnqzxkv?start=2025-08-20&end=2025-08-26

## TL;DR

- State/persistence: Zustand + AsyncStorage
- Navigation: Expo Router + React Navigation (Material Top Tabs)
- Animations: Reanimated (enter/exit and layout transitions)
- Theming: custom color palette, light/dark toggle with a small zustand store
- Accessibility: labeled controls for filter and theme toggle; button roles throughout

---

## Project structure

```
app/
  _layout.tsx               # Root stack (modal) + theme provider
  (tabs)/_layout.tsx        # Bottom tabs config
  (tabs)/index.tsx          # Home screen + top tabs
  modal.tsx                 # Task creation form (date & time pickers)
components/
  Themed.tsx                # Themed Text and View convenience wrappers
  useColorScheme.ts(.web)   # Reads theme override store or OS preference
constants/Colors.ts         # Palette (text/background + surface/surfaceVariant + tint)
features/
  tasks-list/
    model/
      types.ts              # Task model and helpers
      store.ts              # Zustand store + AsyncStorage persistence + filter state
    hooks/
      useTasksController.ts # UI-agnostic business logic for tasks
    view/
      TaskList.tsx          # Renders tasks list + undo toast (UI layer)
      components/
        GreetingHeader.tsx  # Header: My Work row + greeting + filter + theme toggle
        TaskItem.tsx        # List row with enter/exit animations
  ui/
    themeStore.ts           # Theme override (system/light/dark)
```

The “feature-first” layout keeps business logic and data structures under `features/tasks-list/model` and `hooks`, while view components live under `features/tasks-list/view`.

---

## Important dependencies

- expo-router: File-based routing (tabs + modal)
- @react-navigation/material-top-tabs: Top tabs inside Home
- zustand: App state (tasks, filter, theme override)
- @react-native-async-storage/async-storage: Persistence for tasks and filter
- react-native-reanimated: Row enter/exit + layout animations, and timed progress bar for Undo
- @react-native-community/datetimepicker: Date/time input in the creation modal

---

## Color palette and theming

`constants/Colors.ts` defines the palette for both modes:
- primary tint: `#064148`
- surface (light): `#F9FAFB`
- surfaceVariant (light): `#FFFFFF`
- Dark equivalents for surface/surfaceVariant

The bottom tab bar, header background, and Home container use `surface`. Cards use `surfaceVariant` with a subtle `surface` border.

### Theme override

- `features/ui/themeStore.ts` stores an override (`system` | `light` | `dark`).
- `components/useColorScheme.ts` consumes the override; if `system`, it falls back to the React Native color scheme.
- The header exposes a moon/sun icon to toggle the theme.

---

## Tasks domain model

`features/tasks-list/model/types.ts`
- Task
  - id: string
  - title: string
  - metadata:
    - contextLabel?: string
    - dueAt?: number (epoch millis)
    - dueDateFormatted?: string (localized)
    - overdue: boolean
- Helpers
  - formatDueDate(Date) -> string: Localized concise date/time string
  - buildTask(params) -> Task: Normalizes inputs and precomputes metadata (dueAt, overdue, formatted date)

---

## Store (logic)

`features/tasks-list/model/store.ts`
- Persistence via AsyncStorage with zustand `persist`
- State
  - tasks: Task[] (persisted)
  - filter: `all | today | overdue` (persisted)
- Actions
  - setTasks(updater): Value or producer to replace the `tasks` array
  - setFilter(f): Updates the current filter
  - seedDefault(): Development helper to populate the store if empty

The store is intentionally minimal; most interactions flow through the controller.

---

## Controller (logic)

`features/tasks-list/hooks/useTasksController.ts`

This hook is the single place where list logic lives. It is UI-agnostic: it doesn’t import view components and can be unit-tested in isolation.

- Derived data
  - `tasks`: filtered view of the stored tasks
    - `all`: no filter
    - `today`: `dueAt` is within [start-of-today, end-of-today)
    - `overdue`: `metadata.overdue === true`

- Actions
  - `completeTask(id)`
    - Removes the task from the list and stores it in an internal buffer
    - Exposes `lastCompleted` so the UI can render an undo toast
  - `undoLast()`
    - Reinserts the buffered task back at the original index
  - `dismissUndo()`
    - Clears `lastCompleted` and drops the buffer

- Lifecycle
  - `seedDefault()` is invoked once on mount to ensure there is demo data the first time.

---

## Interactions and animations (overview)

- Row enter/exit
  - New items enter with `SlideInRight(280ms)` and layout spring
  - Completed items exit with `SlideOutLeft(400ms)` and the list reflows via layout animation

- Undo toast
  - Appears at the bottom, with a 7s progress bar (Reanimated `withTiming`)
  - `runOnJS` safely calls `dismissUndo()` when the timer completes
  - Tapping Undo cancels the progress animation and restores the task

- Filtering
  - A dropdown in the header (All/Today/Overdue) updates `store.filter`
  - The controller returns a filtered list based on this state

---

## Creating tasks

- Open the modal via the center plus button in the bottom tab bar
- Form fields: title (required), context label (optional), date and time pickers
- On submit, a Task is built with `buildTask` and inserted at the top of the list. The new item animates in.

---

## Running the project

1) Install dependencies
```
pnpm i
# or
npm i
# or
yarn
```

2) Start the dev server
```
npm run start
# or
pnpm start
```
Choose a target (iOS simulator / Android / Web), or scan the QR code with Expo Go.

### Run on a physical device with Expo Go

1. Install Expo Go on your device:
   - iOS: App Store — search for "Expo Go"
   - Android: Google Play — search for "Expo Go"
2. Ensure your phone and your development machine are on the same Wi‑Fi network.
3. Start the dev server (see step 2 above).
4. Scan the QR code printed in your terminal/Expo DevTools:
   - iOS: Use the Camera app and tap the notification.
   - Android: Open Expo Go and scan the QR code.
5. The app will load directly in Expo Go. Edits to the code will hot-reload.

---

## To-do

- Improve colors and contrast in dark mode (text/secondary text, metadata chips)
- Migrate icons to SVG assets (e.g., react-native-svg) for sharper rendering across platforms
- Fix and polish Web support (dropdown layering/backdrops, focus/hover states, keyboard navigation)
- Drag-to-reorder with react-native-gesture-handler + Reanimated
- Add unit tests for controller and store logic (filters, undo buffer)
- Add E2E smoke tests (Detox or Playwright for web)

## Trade offs

- There were problems with Expo Snack dependencies management, so no Snacks for now
- Github Pages build done, but buttons don't work if not inside a <Link> Component, so the functions for adding tasks is not working, filtering, and dark mode.

## Notes & future work

- Drag-to-reorder: best implemented with `react-native-gesture-handler` + Reanimated for a smooth long-press drag. A keyboard-accessible fallback (Move up/down actions) can be added for screen readers.
- Accessibility: The filter dropdown and theme toggle have accessibility labels; more explicit labels can be added for task actions (e.g., “Complete task {title}”).
- Data: Calls to a backend can be introduced behind the store/controller interfaces without affecting views.

---

## Why this architecture?

- Feature-first: keeps related model, controller, and views in one place.
- Store vs controller: persistence/state and UI behavior are separated, enabling simpler unit tests and safer refactors.
- Expo Router: easy nested navigation (tabs + modal) with file-based conventions.
- Reanimated: efficient animations and worklet-safe timing for the undo progress.

