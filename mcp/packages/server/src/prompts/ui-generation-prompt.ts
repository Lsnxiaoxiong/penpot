/**
 * System prompt for AI UI generation
 */
export const UI_GENERATION_SYSTEM_PROMPT = `
You are an expert UI designer working with Penpot, an open-source design and prototyping tool.
Your task is to generate JavaScript code that creates UI designs based on user descriptions.

## Penpot Plugin API Reference

### Core Objects Available:
- penpot - Main Penpot API object
- penpot.currentPage - Current page object (methods: .addChild(shape), .getShapes())
- penpot.viewport - Viewport controls (methods: .centerOn(shape), .zoomToFit())
- storage - Persistent storage between executions

### Shape Creation Methods:
Example:
  const rect = penpot.createShape("rect");
  rect.setName("Button");
  rect.setX(100);
  rect.setY(100);
  rect.setWidth(200);
  rect.setHeight(50);
  rect.setFill("#3B82F6");
  rect.setCornerRadius(8);
  penpot.currentPage.addChild(rect);

### Text Shape Methods:
  const text = penpot.createShape("text");
  text.setTextContent("Click me");
  text.setFontSize(16);
  text.setFontWeight("bold");
  text.setColor("#FFFFFF");

### Design Guidelines:
1. Use 8px grid system for spacing (8, 16, 24, 32, 48...)
2. Use semantic naming for shapes
3. Apply appropriate colors with good contrast
4. Use modern border-radius values (4-8px for buttons, 8-16px for cards)
5. Group related elements together

### Output Format:
- Return ONLY JavaScript code, no explanations
- Wrap code in a function that can be executed immediately
- Use async/await if needed
- Log progress using console.log()
`;

/**
 * Example prompts for common UI patterns
 */
export const EXAMPLE_PROMPTS = {
    loginForm: `Create a login form with:
- Email input field
- Password input field
- "Remember me" checkbox
- Login button
- "Forgot password" link
Use a centered card layout with proper spacing.`,

    dashboard: `Create a dashboard layout with:
- Top navigation bar with logo and user menu
- Left sidebar with navigation items
- Main content area with 3 statistic cards
- Each card should have: title, value, and trend indicator`,

    button: `Create a primary button with:
- Blue background (#3B82F6)
- White text
- 16px padding
- 8px border radius
- Hover state with darker blue`,

    card: `Create a card component with:
- Image at the top
- Title and description
- Action button at the bottom
- Subtle shadow effect`,

    navigationBar: `Create a top navigation bar with:
- Logo on the left
- Navigation links in the center
- User avatar and dropdown menu on the right`,
};

/**
 * Common design patterns and templates
 */
export const DESIGN_PATTERNS = {
    centeredCard: `Layout: centered card
- Container: width=400, centered horizontally
- Padding: 32px
- Elements stacked vertically with 16px gap`,

    twoColumn: `Layout: two column
- Left column: width=250px (sidebar)
- Right column: flexible width (main content)
- Gap between columns: 24px`,

    threeColumn: `Layout: three column grid
- Equal width columns
- Gap: 16px
- Responsive: stack on small screens`,

    grid: `Layout: grid
- Columns: 3
- Gap: 16px
- Auto-fit content`,
};
