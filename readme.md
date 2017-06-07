# User styles as script

Convert your user styles into a user script.

Styles are written using Stylus. Can be hosted online.

## Usage

* Clone or fork and remove personal information.
* Edit `lib/styles.styl` with your user styles.
* Run `npm run build`. This will generate `dist/index.user.js`.

For web hosting:

* Update `homepage` in `package.json` to point to the root of your website.
* You may now use this file (i.e. upload it to a static web site) *or* run the build process in your continuous delivery provider.
  * If you have a Gitlab account, you may use the provided template to set up Gitlab CI to continuously deploy to Gitlab Pages.

## `@document` support

We have limited support for `@document` rules:

* `@document domain('example.com')`
* `@document regexp('^https:\/\/[^.]+\.wikipedia.org')`
