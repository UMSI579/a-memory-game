# Memory Game – Component Tree, Props & State

React apps use a hierarchical component structure. 
Here’s the structure for this app

## 1. Refresher

### 1.1 The basics of a component

```
// 👇props are passed in
const SomeComponent = (props) => {
   const [moves, setMoves] = useState(0);
   
   // 👇 This variable is recreated each time the 
   // component re-renders.
   const gameName = 'Great game';
   
   return (<div>
        <h2>{gameName}</h2>
        <button
          onClick={() => setMoves((prev) => prev + 1)}
        >
          Update Moves
        </button>
   </div>)
}
```
### 1.2 Things to keep in mind:
- When a component *initially* appears, we say the component is **Mounted**
- A component will re-render when
    - Its state changes
    - Any of the props it receives have changed
  
When a component re-renders it's effectively re-created with the current state and props values.


#### Reminder: **Props** are what get passed to a component 

Invoke a component with`<SomeComponent foo='bar' />` 
means the component  instance will have `props.foo` with the value `bar`.

#### Reminder: **State** are special values that a component creates
State and the state setters can be passed down to other components, but
the creating-component is the owner of that state.

---


## 2. Mapping out a React Application - Structure

A fairly straightforward way to map out a React application
is to first document the structure as a component tree.

### Component Tree
```
App
│
├── Header
│
├── GameBoard
│    └── Card (many)
│
└── Footer
```

## Mapping out a React Application - Individual parts:

### **App**

- **State:**
    - `cardsData`: Array of card objects (e.g. `{id, value, isFlipped, isMatched}`)
    - `moves`: Number of moves made
    - `matches`: Number of matches found
    - `gameStatus`: "playing" | "won" | "lost"
- **Props:**
    - None (root component)
- **Responsibilities:**
    - Initialize cards
    - Handle game logic/state
    - Pass necessary props to children

### **Header**

- **Props:**
    - `moves`: Number of moves
    - `matches`: Number of matches
    - `gameStatus`: Current game status
- **State:**
    - None
- **Responsibilities:**
    - Display game info (moves, matches, status)

### **GameBoard**

- **Props:**
    - `cardsData`: Array of cards
    - `onCardClick(cardId)`: Callback for card clicks
- **State:**
    - None (stateless, receives props)
- **Responsibilities:**
    - Render list of Card components

### **Card**

- **Props:**
    - `id`: Unique card identifier
    - `value`: Card value (the item to match)
    - `isFlipped`: Whether the card is currently flipped
    - `isMatched`: Whether the card has been matched
    - `onClick(id)`: Callback for click event
- **State:**
    - None (stateless, receives props)
- **Responsibilities:**
    - Display flipped/unflipped UI
    - Handle click event

### **Footer**

- **Props:**
    - None (or could include “Restart Game” button handler)
- **State:**
    - None
- **Responsibilities:**
    - Display copyright, link, etc.

---

## 3. Detailed Component Tree: State & Props Flow

```
App
│
├─ Header: receives moves, matches, gameStatus (props)
│
├─ GameBoard: receives cardsData, onCardClick (props)
│       ├─ Card: receives id, value, isFlipped, isMatched, onClick (props)
│       └─ Card: ...
│
└─ Footer: (no props/state)
```

---

## 4. Sample Card Data Structure

```js
[
  {
    id: 1,
    value: "🐶",
    isFlipped: false,
    isMatched: false
  },
  {
    id: 2,
    value: "🐶",
    isFlipped: false,
    isMatched: false
  },
  // ... more cards
]
```

---

## 5. Additional information

- `cardsData` updates when a card is clicked:
    - Flip cards, check match
    - Update `matches`, `moves`
    - Set `isMatched` on matched pairs
- Pass current state down via props for stateless children

---

This design keeps state centralized in `App` (the top level component). 

In larger apps, *state management* (with Context or Redux) can be used.

