# Component Design: Modal

Documentation for the consistent, premium modal infrastructure used across PrimeraDental portals.

## 1. Visual Structure
Modals feature a high-fidelity "native app" aesthetic with smooth backdrop transitions and responsive safety gutters.

```tsx
<div className="fixed inset-0 z-[999999] p-4 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
    <div className="relative w-[95%] sm:w-full max-w-[720px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-10">
            {/* Modal Body */}
        </div>
        {/* Modal Footer */}
    </div>
</div>
```

## 2. Desktop Standards
- **Width**: Typically `sm:w-full` with a capped `max-w-[720px]` (or `max-w-2xl`).
- **Padding**: Large internal gutters (`sm:p-10`) to provide a spacious, professional administrative feel.
- **Backdrop**: `bg-black/60` with `backdrop-blur-md` to focus attention on the form.
- **Positioning**: Perfectly centered within the viewport.

## 3. Mobile Standards
- **Width**: `w-[95%]` to ensure it never touches the screen edges.
- **Safety Gutters**: The outermost parent container MUST have `p-4` globally. This ensures there is always a visible gap between the modal and the phone's bezel.
- **Height Logic**: Use `max-h-[90vh]` and `overflow-y-auto` with `no-scrollbar` to handle long forms on small devices.
- **Fluid Typography**: Use `clamp()` for titles (e.g., `text-[clamp(18px,2.5vw,22px)]`) to ensure headers fit perfectly without wrapping aggressively.

## 4. Tactile Interactions
- **Z-Index**: Resides at `z-[999999]`.
- **Button Sizing**: Footer buttons should be `py-3.5` with `text-[14px] font-black`.
- **Mobile Buttons**: Use `flex-1` for buttons on mobile to occupy the full width of the row, and `sm:flex-none` on desktop for a compact alignment.
- **Feedback**: Implement `active:scale-95` on all primary interactive elements for a physical response.

---
*Note: This architecture ensures total layout parity between the Patient and Admin portals.*
