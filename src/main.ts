import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment.prod';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

let bip: any = null;

// Administrar el botón de instalación
window.addEventListener("appinstalled", event => {
})

window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    bip = event;
});

document.addEventListener("DOMContentLoaded", event => {

    if (window.matchMedia("(display-mode: standalone)").matches) {
        // Estamos en standalone y no en el browser
        document.querySelector("head")!.innerHTML = `
            <meta name="google" content="notranslate">
        `;
    }
    else{

    const installButton = document.querySelector("#instalacion button");
    if (installButton) {
        installButton.addEventListener("click", async (event) => {
            if (bip) {
                bip.prompt();
                const choiceResult = await bip.userChoice;
                // The deferredPrompt can only be used once.
                bip = null;
                // Act on the user's choice
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt.');
                } else if (choiceResult.outcome === 'dismissed') {
                    console.log('User dismissed the install prompt');
                }
            } else {
                alert("App ya instalada!");
            }
        });
    }
  }
});


  if (environment.production) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist()
              .then(persistent => {
                if (persistent) {
                  console.log('Data will be persisted.');
                } else {
                  console.log('Data may be cleared by the browser.');
                }
              })
              .catch(error => {
                console.error('Error requesting storage persistence:', error);
              });
          }
        })
        
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }


