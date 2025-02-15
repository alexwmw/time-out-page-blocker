const modKey = (userAgentStr) => {
  if (userAgentStr.indexOf("Mac") > 0) {
    return "⌘ command";
  } else if (userAgentStr.indexOf("Win") > 0) {
    return "ctrl";
  } else {
    return "ctrl";
  }
};

import manifest from "../manifest.json";

export const information = [
  `
  ### Version ${manifest.version}
  ### Description
  
  **Time Out : Page Blocker** is a Chrome extension and productivity tool, designed to help you stay focussed.

  **Time Out** blocks websites of your choosing, enabling you to use your internet browser productively without getting distracted by troublesome websites. 
  
  However, unlike other website blockers that make it impossible for you to reach the blocked website, **Time Out** will prompt you to hold down a button for a set time if you decide you really did want to visit the page.
  
  This gives you the choice of whether you want to complete a visit to the site in any given moment, while also giving you time to pause and think. 
  
  This is an advantage over other website blocker that always block web pages, which can get frustrating and result in the user disabling the extension altogether.
  
  ### Add to blocked list
  
  There are two ways to add sites to the block list:
  
  1. Via the extension popup, which can be opened by clicking the extension icon in the Chrome toolbar
  2. Via context menus which can usually be accessed by right-clicking on a webpage
  `,
  `
  Only pages which start with **http://** or **https://** can be blocked. You may need to double click the URL bar to see this.
  
  When adding a page to the block list, you can chose to either block via the root domain (usually the bit that ends in **.com**), or the full web address.
  
  By default, any subpage which starts with a blocked address will also be blocked. This can be toggled on or off in the **block list** tab.
  
  ### Visiting a blocked site
  
  If you try to visit a site on your block list, you will be redirected to the **Time Out** page, where you will be required to hold a button to view the page. The length of time you are required to hold the button can be edited under the **settings** tab.
  
  Once you have unblocked a site, you will be free to view it for a few minutes - provided you have allowed this in **settings**.
  
  If you have have turned on **scheduling**, sites will only be blocked during scheduled hours.
  
  ### Reporting issues
  
  If you discover any bugs or issues, please report them on the official [support page](https://chromewebstore.google.com/detail/hoeinipdpcnbifnmdkfbgmpaccbjpinl/support).
  
  `,
];

export const update_v2_1_0 = [
  `
  # **Time Out : Page Blocker** has been updated!
  ## Version ${manifest.version} - February 2025
  Thank you for using **Time Out : Page Blocker**! This update brings important fixes and improvements.`,
  `
  ### Bugs fixed: 
  - **Scheduling:** Fixed an issue where scheduled blocking times were not consistently applied.
  - **Allow re-visits after unblocking**: Resolved a bug that prevented pages from loading after pressing the unblock button when this setting was disabled.
  
  `,
  `
  ### Improvements:
  - **Context menu items**: Updated wording for better clarity. Added an option to block individual pages while still allowing subpages.
  `,
  `
  ### Need assistance?
  
  If you encounter any issues, please report them on the [support page](https://chromewebstore.google.com/detail/hoeinipdpcnbifnmdkfbgmpaccbjpinl/support).
  
  ###  Enjoying the extension?   ⭐⭐⭐⭐⭐
   
  If you find **Time Out** useful, please consider [leaving a review](https://chromewebstore.google.com/detail/time-out-page-blocker/hoeinipdpcnbifnmdkfbgmpaccbjpinl/reviews) — your support is greatly appreciated!
  `,
];
