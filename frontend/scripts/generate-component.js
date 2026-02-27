#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
    console.error('❌ Please provide a component name');
    console.log('Usage: npm run generate:component ComponentName');
    process.exit(1);
}

// Validate component name
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
    console.error('❌ Component name must be PascalCase (e.g., MyComponent)');
    process.exit(1);
}

const componentDir = path.join(__dirname, '..', 'src', 'components', 'ui', componentName);

// Check if component already exists
if (fs.existsSync(componentDir)) {
    console.error(`❌ Component "${componentName}" already exists`);
    process.exit(1);
}

// Create component directory
fs.mkdirSync(componentDir, { recursive: true });

// Component template
const componentTemplate = `'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export function ${componentName}({ className, children }: ${componentName}Props) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
`;

// Index file template
const indexTemplate = `export { ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
`;

// Write files
fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), componentTemplate);
fs.writeFileSync(path.join(componentDir, 'index.ts'), indexTemplate);

console.log('✅ Component created successfully!');
console.log(`📁 Location: src/components/ui/${componentName}/`);
console.log(`📝 Files:`);
console.log(`   - ${componentName}.tsx`);
console.log(`   - index.ts`);
console.log('');
console.log(`Import with: import { ${componentName} } from '@/components/ui/${componentName}';`);
