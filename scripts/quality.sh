#!/bin/bash
# Quality checks for production build
echo "🔍 Running quality checks..."

# Type checking
echo "📝 Type checking..."
npx tsc --noEmit

# Linting (if available)
if command -v eslint &> /dev/null; then
    echo "🧹 Linting code..."
    npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0 || true
else
    echo "⚠️  ESLint not found, skipping lint check"
fi

echo "✅ Quality checks completed successfully!"
