# Toast Component Usage Guide

This guide explains how to use the custom toast notification system in the smartLET application.

## Overview

The toast system provides a clean, reusable way to show success messages, error notifications, and other feedback to users. It's designed to work seamlessly across desktop and mobile devices.

## Features

- ✅ **Success toasts** with tick icon and theme colors
- ❌ **Error toasts** for error messages
- 📱 **Mobile responsive** - shows at top on mobile, bottom-right on desktop
- 🎨 **Consistent styling** with white background and theme colors
- ⚡ **Easy to use** with simple hook-based API
- 🔄 **Auto-dismiss** with manual close option

## Basic Usage

### 1. Import the hook

```tsx
import { useToast } from "@/hooks/useToast";
```

### 2. Use in your component

```tsx
function MyComponent() {
  const { success, error, toast } = useToast();

  const handleLogin = async () => {
    try {
      await loginUser();
      success("Logged in successfully");
    } catch (err) {
      error("Login failed. Please try again.");
    }
  };

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  );
}
```

## API Reference

### `useToast()` Hook

Returns an object with the following methods:

#### `success(message: string)`
Shows a success toast with a green tick icon.

```tsx
success("Account created successfully!");
success("Settings saved");
success("Password updated");
```

#### `error(message: string)`
Shows an error toast with red styling.

```tsx
error("Invalid credentials");
error("Network error occurred");
error("Failed to save changes");
```

#### `toast(options)`
Shows a custom toast with full control over styling and content.

```tsx
toast({
  title: "Custom Title",
  description: "Custom message",
  variant: "default" | "success" | "destructive"
});
```

#### `dismiss(toastId?: string)`
Dismisses a specific toast or all toasts if no ID provided.

```tsx
const { id } = success("Message");
// Later...
dismiss(id);
// Or dismiss all
dismiss();
```

## Common Use Cases

### Form Submissions

```tsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    success("Form submitted successfully!");
    router.push('/success');
  } catch (err) {
    error("Failed to submit form. Please try again.");
  }
};
```

### Authentication

```tsx
// Login
success("Logged in successfully");

// Signup
success("Account created! Please check your email.");

// Logout
success("Logged out successfully");

// Password reset
success("Password reset link sent to your email");
```

### CRUD Operations

```tsx
// Create
success("Property added successfully");

// Update
success("Property updated successfully");

// Delete
success("Property deleted successfully");

// Error handling
error("Failed to delete property");
```

### File Uploads

```tsx
// Upload success
success("Images uploaded successfully");

// Upload error
error("Failed to upload images. Please try again.");
```

## Mobile Behavior

On mobile devices (screen width < 640px), toasts appear at the top of the screen to ensure they're visible even when forms are displayed in drawers or modals.

## Styling

- **Success toasts**: White background, black text, green tick icon
- **Error toasts**: Red background with appropriate contrast
- **Custom toasts**: Configurable via variant prop

## Best Practices

1. **Keep messages concise** - Users should be able to read them quickly
2. **Use appropriate variants** - Success for positive actions, error for failures
3. **Don't overuse** - Only show toasts for important feedback
4. **Be specific** - "Login successful" is better than "Success"
5. **Handle errors gracefully** - Always show user-friendly error messages

## Integration with Existing Code

To replace existing `sonner` toast usage:

```tsx
// Old way
import { toast } from "sonner";
toast.success("Message");
toast.error("Error");

// New way
import { useToast } from "@/hooks/useToast";
const { success, error } = useToast();
success("Message");
error("Error");
```

## Examples

See the following example components:
- `ToastDemo.tsx` - Basic usage examples
- `ExampleFormWithToast.tsx` - Form integration example

## Technical Details

- Built on top of Radix UI Toast primitives
- Uses Tailwind CSS for styling
- Responsive design with mobile-first approach
- Automatic cleanup and memory management
- TypeScript support with full type safety