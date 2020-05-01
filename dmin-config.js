/* Customization Guide available on:
     https://gatsby-minimalistic-dmin.netlify.com/2020/02/customize/
  ======================================== */
const config = {
  /* Site
  ========================================= */
  title: `lit.codes`, // Displayed in header
  description: `A developer community`, // Site description
  maxWidth: "720px", // Max width of website
  enableAbout: false, // Enables about page
  siteUrl: `https://blog.lit.codes/`, // Used for sitemap; improves SEO

  /* Profile
  ========================================= */
  author: `Lit Codes`, // Name shows on profile
  profileDescription: "A community for developers", // Shows under author name
  profileImageName: `logo.png`, // Place profile.jpg/.jpeg/.png in _assets folder
  location: "", // Location under profileDescription. "" --> disabled
  footerLink: "", // Link to page when you click footer name

  /* Social Media Links
      accountName & emailAddress: leave blank ("") to disable
      showHeaderIcon: shows social media icon in header. When true, must have account name set
  ========================================= */
  socialMediaLinks: {
    email: { emailAddress: "", showHeaderIcon: true },
    github: { accountName: "", showHeaderIcon: true },
    facebook: { accountName: "", showHeaderIcon: true },
    instagram: { accountName: "", showHeaderIcon: true },
    twitter: { accountName: "", showHeaderIcon: true },
    linkedIn: { accountName: "", showHeaderIcon: true }, // Use URL after "linkedin.com/"
    medium: { accountName: "", showHeaderIcon: true } // Use URL after "medium.com/@"
  },

  /* Social Media Share Buttons--available below every post
  ========================================= */
  shareButtons: {
    email: true,
    facebook: false,
    twitter: true,
    reddit: true,
    linkedIn: false
  },

  /* More Custom Settings
  ========================================= */
  defaultTheme: "light", // Options: dark / light -- applied to first visitors
  showTimeToRead: true, // Shows time to read for each post in main page
  breakCodeLines: false, // Breaks long code lines instead of having horizontal scroll
  useLightCodeBlock: true, // Use lighter code block when theme is set to "light"
  faviconSrc: `_assets/logo-small.png`, // Favicon
  gaTrackingId: `UA-147073925-1`, // Your google analytics tracking id--i.e. UA-*****
  googleAdSenseId: ``, // Your google AdSense client id--i.e. ca-pub-****
  fbAppId: ``, // Facebook app id for moderating facebook comments

  /* Styles--use hex value. i.e. visit https://www.color-hex.com/
  ========================================= */
  headerColorLight: "#eee",
  headerColorDark: "#232323",
  bgColorLight: "#f7f7f7",
  bgColorDark: "#26272e",
  /* background colors surrounding profile & posts in main page */
  bgSubColorLight: "#fff",
  bgSubColorDark: "#292a30",

  /* Font Colors */
  fontColorLight: "#313131",
  fontSubColorLight: "#808080",
  fontColorDark: "#d3d3dc",
  fontSubColorDark: "#a1a1a5",
  /* Fonts */
  fontMain: `"Roboto"`, // Main Font
  fontPosts: `"Open Sans"`, // Font inside posts
  fontProfile: `'Oxanium'`, // Font inside profile & title in header
  fontCodeBlocks: `Menlo, Monaco, monospace`, // Font for code blocks

  // These fonts will be used if above fonts are unavailable
  fontsBackUp: `, sans-serif, -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue'`
};

module.exports = config;
