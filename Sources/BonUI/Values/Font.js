//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
//

import { Enum } from "./Enum.js"
import { Length, pixels, parentFontSize } from "./Length.js"

/**
 * @enum
 * @property {Symbol} default       Default text style
 * @property {Symbol} largeTitle    Main heading of the page style
 * @property {Symbol} title         Secondary-level heading of the page
 * @property {Symbol} subheading    Third-level heading of the page
 * @property {Symbol} monospace     Text style for code
 */
export const TextStyle = new Enum("default", "largeTitle", "title", "subheading", "monospace")

/**
 * @enum
 * @property {Symbol} regular       Default text weight
 * @property {Symbol} ultraLight    Very light text weight
 * @property {Symbol} extraLight    Very light text weight. The same as ultraLight
 * @property {Symbol} light         Light text weight
 * @property {Symbol} thin          Thin text weight
 * @property {Symbol} medium        Medium text weight
 * @property {Symbol} semibold      Semibold text weight
 * @property {Symbol} bold          Bold text weight
 * @property {Symbol} heavy         Heavy text weight
 * @property {Symbol} black         Black text weight
 */
export const Weight = new Enum("regular", "ultraLight", "extraLight", "thin", "light", "medium", "semibold", "bold", "heavy", "black")

/**
 * @enum
 * @property {Symbol} normal        Default font style
 * @property {Symbol} italic        Italic font style
 * @property {Symbol} oblique       Oblique font style
 */
export const FontStyle = new Enum("normal", "italic", "oblique")

/**
 * Class that describes font
 */
export class Font {
    /**
     * @param {Object}          options
     * @param {String}          [options.name]          Name of a font
     * @param {Symbol}          [options.textStyle]     Style of a text
     * @param {Length|number}   [options.size]          Size of a font
     * @param {Symbol}          [options.weight]        Weight of a font
     * @param {Symbol}          [options.fontStyle]     Style of a font
     */
    constructor ({ name = null, textStyle = null, size = null, weight = null, fontStyle = null  }) {
        this.name = String(name)
        this.textStyle = TextStyle.contains(textStyle) ? textStyle : TextStyle.default
        this.weight = Weight.contains(weight) ? weight : null
        this.fontStyle = FontStyle.contains(fontStyle) ? fontStyle : null

        if (size instanceof Length || typeof size === "number") {
            this.size = !(size instanceof Length) ? pixels(size) : size
        } else {
            this.size = parentFontSize(1)
        }
    }

    /**
     * Method to create a copy of a font and change some of properties
     * @param {Object}          options
     * @param {String}          [options.name]          Name of a font
     * @param {Symbol}          [options.textStyle]     Style of a text
     * @param {Length|number}   [options.size]          Size of a font
     * @param {Symbol}          [options.weight]        Weight of a font
     * @param {Symbol}          [options.fontStyle]     Style of a font
     */
    with ({ name, textStyle, size, weight, fontStyle }) {
        var clone = Object.assign({}, this)
        
        if (typeof name === "string" || name instanceof String) {
            clone.name = name.toString()
        }

        if (TextStyle.contains(textStyle)) {
            clone.textStyle = textStyle
        }

        if (size instanceof Length || typeof size === "number" || size instanceof Number) {
            clone.size = !(size instanceof Length) ? pixels(size) : size
        }

        if (Weight.contains(weight)) {
            clone.weight = weight
        }

        if (FontStyle.contains(fontStyle)) {
            clone.fontStyle = fontStyle
        }

        return new Font(clone)
    }

    toString () {
        // font-style font-variant font-weight font-size/line-height font-family
        var result = ""

        if (FontStyle.contains(this.fontStyle)) {
            result += fontStyleToCssValue(this.fontStyle) + " "
        }

        if (Weight.contains(this.weight)) {
            result += weightToCssValue(this.weight) + " "
        }

        if (this.size instanceof Length || typeof this.size === "number") {
            result += (this.size instanceof Length ? this.size : pixels(this.size)) + " "
        } else {
            result += "1em "
        }

        if (typeof this.name === "string") {
            result += this.name
        } else {
            result += "inherit"
        }

        return result.trim()
    }

    static default = new Font({ 
        name: "sans-serif", 
        size: pixels(18), 
        textStyle: TextStyle.default, 
        weight: Weight.regular 
    })
    
    static title = this.default.with({ 
        size: pixels(30), 
        textStyle: TextStyle.title, 
        weight: Weight.medium 
    })
    
    static largeTitle = this.title.with({ 
        size: pixels(36), 
        textStyle: TextStyle.largeTitle, 
        weight: Weight.bold 
    })
    
    static subheading = this.title.with({
        size: pixels(22),
        textStyle: TextStyle.subheading
    })
    
    static monospace = this.default.with({
        name: "monospace",
        textStyle: TextStyle.monospace,
        size: pixels(16)
    })
}

/**
 * Function to convert the TextStyle item to the tag name
 * @param   {Symbol} style 
 * @returns {String} HTML tag name
 */
export function textStyleToTagName (style) {
    if (!(TextStyle.contains(style))) {
        return undefined
    }
    
    switch (style) {
        case TextStyle.default:
            return "p"
        case TextStyle.largeTitle:
            return "h1"
        case TextStyle.title:
            return "h2"
        case TextStyle.subheading:
            return "h3"
        case TextStyle.monospace:
            return "code"
        default:
            return TextStyle.getIdentifier(style)
    }
}

/**
 * Function to convert the Weight item to the css font-weight value
 * @param   {Symbol} weight 
 * @returns {String} CSS `font-weight` value
 */
export function weightToCssValue (weight) {
    if (!(Weight.contains(weight))) {
        return undefined
    }

    switch (weight) {
        case Weight.ultraThin:
            return "100"
        case Weight.thin:
        case Weight.ultraLight:
        case Weight.extraLight:
            return "200"
        case Weight.light:
            return "300"
        case Weight.regular:
            return "400"
        case Weight.medium:
            return "500"
        case Weight.semibold:
            return "600"
        case Weight.bold:
            return "700"
        case Weight.heavy:
            return "800"
        case Weight.black:
            return "900"
    }
}

/**
 * Function to convert the FontStyle item to the css font-style value
 * @param   {Symbol} fontStyle 
 * @returns {String} CSS `font-style` value
 */
export function fontStyleToCssValue(fontStyle) {
    if (!(FontStyle.contains(fontStyle))) {
        return undefined
    }

    switch (fontStyle) {
        case FontStyle.normal:
            return "normal"
        case FontStyle.italic:
            return "italic"
        case FontStyle.oblique:
            return "oblique"
    }
}
