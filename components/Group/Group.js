import Component from '../Component/index'
import { extend, isPlainObject } from '../util/index'
import Field from '../Field/index'

class Group extends Field {
    constructor(props, ...mixins) {
        const defaults = {
            fields: [],
            fieldDefaults: { component: Field },
            action: null,
        }

        super(Component.extendProps(defaults, props), ...mixins)
    }

    _created() {
        super._created()
        this.fields = []
    }

    _config() {
        this._addPropStyle('inline', 'striped', 'line')
        const { action, fields, fieldDefaults, value } = this.props
        const children = []

        for (let i = 0; i < fields.length; i++) {
            let fieldProps = fields[i]
            if (isPlainObject(value)) {
                if (fieldProps.flatValue === true) {
                    fieldProps.value = value
                }
                else if (fieldProps.value === null || fieldProps.value === undefined) {
                    fieldProps.value = value[fieldProps.name]
                }
            }
            fieldProps.__group = this
            fieldProps = Component.extendProps(fieldDefaults, fieldProps)
            children.push(fieldProps)
        }

        if (action) {
            children.push({
                component: Field,
                control: action
            })

        }

        this.setProps({
            control: { children: children }
        })

        super._config()
    }

    getValue() {
        const value = {}
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i]
            if (field.getValue) {
                const fieldValue = field.getValue()
                if (field.props.flatValue === true) {
                    extend(value, fieldValue)
                }
                else {
                    value[field.name] = fieldValue
                }
            }
        }

        return value
    }

    setValue(value) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i]
            if (field.setValue) {
                let fieldValue = value
                if (field.props.flatValue === false) {
                    if (isPlainObject(value)) {
                        fieldValue = value[field.name]
                    }
                }
                if (fieldValue === undefined) {
                    fieldValue = null
                }
                field.setValue(fieldValue)
            }
        }
    }

    validate() {
        const invalids = []
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i]
            if (field.validate) {
                const valResult = field.validate()

                if (valResult !== true) {
                    invalids.push(field)
                }
            }
        }

        if (invalids.length > 0) {
            invalids[0].focus()
        }

        return invalids.length === 0
    }

    getField(fieldName) {
        if (typeof fieldName === 'string') {
            // Handle nested keys, e.g., "foo.bar" "foo[1].bar" "foo[key].bar"
            const parts = fieldName.split('.')
            let curField = this
            if (parts.length) {
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i]
                    curField = curField._getSubField(part)
                    if (!curField) {
                        break
                    }
                }
            }

            return curField
        }
    }

    _getSubField(fieldName) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i]
            if (field.name === fieldName) {
                return field
            }
        }

        return null
    }

    _clear() {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i]
            if (field.setValue) {
                field.setValue(null)
            }
        }
    }
}

Component.register(Group)

export default Group