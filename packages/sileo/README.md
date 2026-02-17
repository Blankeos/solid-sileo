<div align="center">
  <h1>Sileo</h1>
  <p>An opinionated, physics-based toast component for SolidJS.</p>
  <video src="https://github.com/user-attachments/assets/a292d310-9189-490a-9f9d-d0a1d09defce"></video>
</div>

### Installation

```bash
npm i solid-sileo solid-js
```

### Getting Started

```tsx
import { Toaster, sileo } from "solid-sileo";

export default function App() {
	return (
		<>
			<Toaster position="top-right" />
			<button
				type="button"
				onClick={() => sileo.success({ title: "Saved", description: "All done" })}
			>
				Show Toast
			</button>
		</>
	);
}
```
