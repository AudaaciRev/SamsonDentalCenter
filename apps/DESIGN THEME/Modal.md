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

## 3. Mobile Standards (iOS Bottom Sheet)
To provide a more native mobile experience, modals on small screens transition from centered dialogs to **Bottom Sheets**.

- **Positioning**: Use `items-end` to anchor the modal to the bottom of the viewport.
- **Shape**: Use `rounded-t-3xl` and `rounded-b-none` to create the sheet look.
- **Safety Gutters**: Mobile sheets are typically full-width (`w-full`) with `p-0` container padding.
- **Grab Handle**: Include a centered "Grab Handle" (`w-12 h-1.5 bg-gray-200 rounded-full`) at the top of the sheet to indicate dragability/dismissibility.
- **Animation**: Modals should animate using `slide-in-from-bottom` on mobile and `slide-in-from-top` or `zoom-in` on desktop.

## 4. Tactile Interactions & Typography
- **Z-Index**: Resides at `z-[999999]`.
- **Fluid Buttons**: Footer buttons must use fluid font sizes to maintain readability: `text-[10px] sm:text-xs font-black`.
- **Button Sizing**: Footer buttons should be `h-10` on mobile and `h-12` on desktop with `rounded-lg` to `rounded-xl` scaling.
- **Mobile Buttons**: Use `flex-1` for buttons on mobile to occupy the full width of the row, and `sm:flex-none` on desktop for a compact alignment.
- **Feedback**: Implement `active:scale-95` on all primary interactive elements for a physical response.

## 5. Sticky Action Footers
To ensure primary actions (Save Changes, Cancel) are always accessible, use the **Sticky Footer** pattern in the `Modal` component.

- **Implementation**: Pass buttons into the `footer` prop of the `Modal`.
- **Logic**: Use the HTML `form` attribute on the submit button (e.g., `form="target-form-id"`) to allow submission from outside the scrolling body.
- **Styling**: `p-6 sm:p-8` padding with a `gray-100` top border and a subtle `gray-50/50` background to distinguish from the body.

## 6. Compact Media Management
For internal administrative file/photo updates, keep UI elements compact to focus on the action.

- **Image Preview**: Fixed height `h-40` with `rounded-2xl` corners.
- **Upload Area**: Fixed height `h-32` border-dashed dropzone.
- **Iconography**: Scaled down icons (`size={32}` for previews, `size={8}` for dropzone SVGs) to maintain an understated, professional feel.

---
*Note: These patterns ensure UX consistency and action visibility across all Admin portals.*
