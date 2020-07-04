//
// Copyright (c) 2020 Teplovs
// Licensed under the Apache License, version 2.0
// 

import { convertToViewBody, flattenArray, verticalAlignmentToAlignItems } from "../../Values/Helpers.js"
import { VerticalAlignment } from "../../Values/Enums/Alignment.js"
import { InvalidValueException } from "../../Values/Exceptions.js"
import { SizeModifier } from "../../Modifiers/SizeModifier.js"
import { VNode } from "../../../VirtualDOM/VNode.js"
import { Spacer } from "../Generic/Spacer.js"
import { Column } from "./Column.js"

export class Row extends Column {
    /**
     * @param {Body}            items               items of column
     * @param {*}               [options]
     * @param {Symbol}          [options.alignment] item of `VerticalAlignment` enum
     * @param {number|Length}   [options.spacing]   space between items
     */
    constructor (items, { alignment = VerticalAlignment.center, spacing = 10 } = {}) {
        super(items, { spacing })

        if (!(VerticalAlignment.contains(alignment))) {
            throw new InvalidValueException(`VerticalAlignment enum does not contain item passed`)
        }

        this.alignment = alignment
    }

    body () {
        var items = convertToViewBody(this.items)
        
        if (this.spacing.value !== 0) {
            items = flattenArray(
                items.map((item, index) => {                    
                    if (item instanceof Spacer || (index < items.length - 1 && items[index + 1] instanceof Spacer) || index === items.length - 1) {
                        return item
                    }

                    return [
                        item,
                        new Spacer().size({ width: this.spacing })
                    ]
                })
            )
        }

        return new VNode("div", {
            body: items,
            styles: {
                alignItems: verticalAlignmentToAlignItems(this.alignment)
            },
            attributes: {
                class: "bon-ui-row"
            }
        })
    }
}
