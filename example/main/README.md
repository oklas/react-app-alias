# Demo

## react-scripts patched

Patched due to [create-react-app #9921](https://github.com/facebook/create-react-app/pull/9921) not yet released
Wait for any crete-react-app version above 4.0
after upgrade - remove **appropriate** patches
If no any more patches:
* remove deps: patch-package postinstall-postinstall  
* remove "postinstall": "patch-package" from "scripts" (package.json)

