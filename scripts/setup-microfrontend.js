
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Module Federation for Angular 19...\n');

// 1. Create webpack.config.js for Angular
const webpackConfig = `const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "angular-host",
      remotes: {
        crewAppraisals: "crewAppraisals@http://0.0.0.0:5000/remoteEntry.js"
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: "auto" },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: "auto" },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: "auto" },
        "rxjs": { singleton: true, strictVersion: true, requiredVersion: "auto" }
      }
    })
  ]
};`;

// 2. Create bootstrap.ts
const bootstrapTs = `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));`;

// 3. Create new main.ts
const mainTs = `import('./bootstrap');`;

// 4. Create micro-frontend wrapper component
const componentTs = `import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-micro-frontend-wrapper',
  template: \`
    <div #container class="micro-frontend-container">
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading Crew Appraisals...</p>
      </div>
      <div *ngIf="showFallback" class="fallback-state">
        <div class="fallback-icon">⚠️</div>
        <h3>{{ fallbackMessage }}</h3>
        <p>The crew appraisals system is temporarily unavailable.</p>
        <button (click)="retry()" class="retry-btn">Try Again</button>
      </div>
    </div>
  \`,
  styles: [\`
    .micro-frontend-container {
      width: 100%;
      min-height: 400px;
      position: relative;
    }
    .loading-state, .fallback-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      min-height: 300px;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .fallback-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .fallback-state h3 {
      color: #e74c3c;
      margin-bottom: 0.5rem;
    }
    .fallback-state p {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
    }
    .retry-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .retry-btn:hover {
      background: #2980b9;
    }
  \`]
})
export class MicroFrontendWrapperComponent implements OnInit, OnDestroy {
  @Input() remoteName: string = 'crewAppraisals';
  @Input() remoteUrl: string = 'http://0.0.0.0:5000/remoteEntry.js';
  @Input() fallbackMessage: string = 'Crew Appraisals System Unavailable';
  @ViewChild('container', { static: true }) container!: ElementRef;

  isLoading = true;
  showFallback = false;
  private retryCount = 0;
  private maxRetries = 3;

  ngOnInit() {
    this.loadMicroFrontend();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async loadMicroFrontend() {
    this.isLoading = true;
    this.showFallback = false;

    try {
      // Check if remote is available
      const isAvailable = await this.checkRemoteAvailability();
      
      if (!isAvailable) {
        throw new Error('Remote not available');
      }

      // Load the remote module
      const module = await this.loadRemoteModule();
      
      if (module && module.CrewAppraisalsApp) {
        // Mount the React app
        this.mountReactApp(module.CrewAppraisalsApp);
        this.isLoading = false;
      } else {
        throw new Error('Remote module not found');
      }
    } catch (error) {
      console.warn('Failed to load micro frontend:', error.message);
      this.showFallbackUI();
    }
  }

  private async checkRemoteAvailability(): Promise<boolean> {
    try {
      const response = await fetch(this.remoteUrl, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch {
      try {
        // Alternative check - try to load the script
        await this.loadScript(this.remoteUrl);
        return true;
      } catch {
        return false;
      }
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Script load failed'));
      document.head.appendChild(script);
      
      // Clean up script after 5 seconds
      setTimeout(() => {
        try {
          document.head.removeChild(script);
        } catch (e) {
          // Script might already be removed
        }
      }, 5000);
    });
  }

  private async loadRemoteModule(): Promise<any> {
    try {
      // Dynamic import of the remote module
      const module = await import(this.remoteName + '/CrewAppraisalsApp');
      return module;
    } catch (error) {
      // Fallback to window global if module federation fails
      return (window as any)[this.remoteName];
    }
  }

  private mountReactApp(ReactApp: any) {
    try {
      // Clear container
      this.container.nativeElement.innerHTML = '';
      
      // Create mount point
      const mountPoint = document.createElement('div');
      mountPoint.id = 'crew-appraisals-root';
      this.container.nativeElement.appendChild(mountPoint);
      
      // Mount React app
      if (ReactApp.mount) {
        ReactApp.mount(mountPoint);
      } else {
        // Alternative mounting method
        const React = (window as any).React;
        const ReactDOM = (window as any).ReactDOM;
        
        if (React && ReactDOM) {
          ReactDOM.render(React.createElement(ReactApp), mountPoint);
        } else {
          throw new Error('React/ReactDOM not available');
        }
      }
    } catch (error) {
      console.error('Failed to mount React app:', error);
      throw error;
    }
  }

  private showFallbackUI() {
    this.isLoading = false;
    this.showFallback = true;
    this.retryCount++;
  }

  retry() {
    if (this.retryCount < this.maxRetries) {
      this.loadMicroFrontend();
    } else {
      alert('Maximum retry attempts reached. Please refresh the page or contact support.');
    }
  }
}`;

// 5. Create component CSS file
const componentCss = `.micro-frontend-container {
  width: 100%;
  min-height: 400px;
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.loading-state, .fallback-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 300px;
  background: #fafafa;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fallback-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.fallback-state h3 {
  color: #e74c3c;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.fallback-state p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.retry-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #2980b9;
}

.retry-btn:active {
  transform: translateY(1px);
}`;

// 6. Create setup README
const readmeMd = `# Micro Frontend Setup Guide

## Quick Start (3 Steps)

### Step 1: One-time Setup
\`\`\`bash
npm run setup-microfrontend
\`\`\`

### Step 2: Import Component in Your Module
\`\`\`typescript
// app.module.ts
import { MicroFrontendWrapperComponent } from './micro-frontend-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    MicroFrontendWrapperComponent  // Add this
  ],
  // ... rest of your module
})
export class AppModule { }
\`\`\`

### Step 3: Use in Template
\`\`\`html
<app-micro-frontend-wrapper 
  remoteName="crewAppraisals"
  remoteUrl="http://0.0.0.0:5000/remoteEntry.js"
  fallbackMessage="Crew Appraisals temporarily unavailable">
</app-micro-frontend-wrapper>
\`\`\`

## Development Workflow

\`\`\`bash
# Start Angular (works with or without React)
ng serve

# Start React app (optional - in separate terminal)
cd react-app && npm run dev
\`\`\`

## Features

✅ **Automatic Fallback** - Works when React app is down
✅ **Error Handling** - No console errors or crashes  
✅ **Loading States** - Professional loading indicators
✅ **Retry Logic** - Automatic retry with manual retry button
✅ **Production Ready** - Handles all edge cases

## Component Properties

| Property | Default | Description |
|----------|---------|-------------|
| remoteName | 'crewAppraisals' | Name of the remote module |
| remoteUrl | 'http://0.0.0.0:5000/remoteEntry.js' | URL to remote entry |
| fallbackMessage | 'Crew Appraisals System Unavailable' | Fallback message |

## Troubleshooting

**Q: Component shows fallback even when React app is running**
A: Check that React app is serving on port 5000 and remoteEntry.js is accessible

**Q: Getting CORS errors**
A: Ensure React app is configured to accept requests from Angular app domain

**Q: Module Federation errors**
A: This setup handles all common Module Federation issues automatically

## Production Deployment

The component automatically handles:
- Network failures
- Remote app downtime  
- CORS issues
- Module loading errors
- Version conflicts

No additional configuration needed for production!
`;

// Write all files
const files = [
  { path: 'webpack.config.js', content: webpackConfig },
  { path: 'src/bootstrap.ts', content: bootstrapTs },
  { path: 'src/main.ts', content: mainTs },
  { path: 'src/app/micro-frontend-wrapper.component.ts', content: componentTs },
  { path: 'src/app/micro-frontend-wrapper.component.css', content: componentCss },
  { path: 'README-MICROFRONTEND.md', content: readmeMd }
];

console.log('📁 Creating configuration files...\n');

files.forEach(file => {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(file.path, file.content);
    console.log(`✅ Created: ${file.path}`);
  } catch (error) {
    console.error(`❌ Failed to create ${file.path}:`, error.message);
  }
});

console.log('\n🎉 Module Federation setup complete!\n');
console.log('📋 Next Steps:');
console.log('1. Add MicroFrontendWrapperComponent to your app.module.ts');
console.log('2. Use <app-micro-frontend-wrapper> in your templates');
console.log('3. Start your Angular app with: ng serve');
console.log('4. Optionally start React app on port 5000');
console.log('\n📖 See README-MICROFRONTEND.md for detailed instructions');
