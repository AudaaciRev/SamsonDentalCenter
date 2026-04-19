# Component Design: Toast Notification

Documentation for the high-fidelity, high-priority notification system used for real-time interaction feedback.

## 1. Visual Structure
Toasts are premium, border-driven cards that float above all other UI elements (including active modals).

```tsx
<div className="fixed top-[4.5rem] sm:top-24 right-4 sm:right-6 z-[9999999] flex flex-col gap-3 pointer-events-none">
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 flex gap-4 items-center shadow-lg animate-in slide-in-from-right-10 fade-in duration-500">
        <div className="status-icon w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <Check size={24} />
        </div>
        <div className="content">
            <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Success</h4>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Profile specialized successfully!</p>
        </div>
    </div>
</div>
```

## 2. Desktop Standards
- **Positioning**: Fixed to the top-right corner at `top-24 right-6`. This aligns it perfectly with the standard admin sidebar and header layout.
- **Radius**: Large `rounded-3xl` for a soft, premium dashboard aesthetic.
- **Shadow**: Subtle `shadow-lg` for depth without clutter.

## 3. Mobile Standards
- **Positioning**: Fixed at `top-[4.5rem] right-4`. The reduced top margin accounts for smaller mobile navigation headers.
- **Width**: `max-w-[calc(100vw-2rem)]` to ensure the toast stays within the safe zone of the screen.
- **Radius**: Scaled down slightly to `rounded-2xl` better fit smaller mobile viewports.

## 4. Interaction & Style Standards
- **Z-Index**: CRITICAL. Resides at `z-[9999999]` (7 nines) to ensure it always appears on top of modals (`z-[999999]`).
- **Timing (The 0ms Rule)**: Feedback MUST be instantaneous. Trigger `showToast` exactly when the user clicks 'Save', rather than waiting for the simulated API delay.
- **Emoji Restriction**: 🚫 **STRICTLY NO EMOJIS.** All toast messages must be plain text. Visual hierarchy is handled by SVGs (Lucide icons); text-based emojis are unprofessional in this admin context.
- **Color Tokens**:
    - **Success**: `bg-emerald-500` (SVG) / `text-emerald-500`
    - **Error**: `bg-red-500` (SVG) / `text-red-500`
    - **Notice**: `bg-amber-500` (SVG) / `text-amber-500`
- **Animations**: Always use `animate-in slide-in-from-right-10 fade-in duration-500` for a smooth entry transition.

---
*Note: This system ensures that the user is always aware of their action status, regardless of context.*
