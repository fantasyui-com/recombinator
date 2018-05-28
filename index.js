#!/usr/bin/env node

/**
 * Module dependencies.
 */

const fs = require('fs');
const postcss = require('postcss');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const colorFunction = require("postcss-color-function")

const mergeRules = require('postcss-merge-rules');
const revolutionize = require('revolutionize');
const webfonts = require('web-fonts');
const cssnano = require('cssnano');

const program = require('commander');

program
  .version('0.1.0')
  .option('-s, --skin [skin]', 'Name of skin to use: charcoal cream deep glass solar tint')
  // ... //
  .option('-i, --input [file]', 'path to input file')
  .option('-o, --output [file]', 'path to output file')
  // ... //
  .parse(process.argv);

const defaults = {
  skin: 'cream',
  input: '',
  output: '',
};
const options = {};

Object.keys(defaults).forEach(funciton(key){
  options.key = program[key]||defaults[key];
})

const specification = {
  import: "url('https://fonts.googleapis.com/css?family=Roboto:100')",
  family: "'Roboto', sans-serif",
  selector: 'html, input, button',
};

const declaration = {
  theme: options.skin,

  /*
    Selectror Mapping,

  */

  selectors: {
  /*    SELECTOR MAPPING    */
  /* SOURCE   | DESTINATION */
  /* SELECTOR | SELECTOR */
         page: ['.html'], /* MEANING: copy rules from .page in cream.css over to .html in dest.css*/
    container: ['.cgui-container'],
    component: ['.cgui-left', '.cgui-right'],
        label: ['.cgui-text', '.cgui-muted', 'html, input, button'],
        input: ['.cgui-command'],
       button: ['.cgui-execute'],
  /*


  */

  }

}

fs.readFile(options.input, (err, css) => {

postcss([

  precss,
  colorFunction,
  revolutionize(declaration),
  webfonts(specification),
  autoprefixer,
  mergeRules,
  cssnano({ preset: 'default' }),

]).process(css, { from: options.input, to: options.output })
  .then(result => {
    fs.writeFile(options.output, result.css);
    if ( result.map ) fs.writeFile(options.output+'.map', result.map);
  }).catch(err=>{console.error(__filename, err)});
});
