import Component from '../Component/index'
import Group from '../Group/Group'

class GroupList extends Group {
    constructor(props, ...mixins) {
        const defaults = {
            fieldDefaults: { component: Group }
        }

        super(Component.extendProps(defaults, props), ...mixins)
    }

    _created() {
        super._created()
    }

    _config() {
        const that = this
        const { groupDefaults, value } = this.props
        const extGroupDefaults = Component.extendProps(groupDefaults, {
            _config: function () {
                const group = this
                this.setProps({
                    actions: [{
                        component: 'Button',
                        text: '移除',
                        onClick: () => {
                            group.remove()
                            that._onValueChange()
                        }
                    }]
                })
            }
        })

        const groups = []
        if (Array.isArray(value)) {
            value.forEach(function (item) {
                groups.push(Component.extendProps(extGroupDefaults, { value: item }))
            })
        }

        this.setProps({
            fields: groups,
            fieldDefaults: extGroupDefaults,
            contentActions: [{
                component: 'Button',
                text: '添加',
                onClick: () => {
                    that.appendField(extGroupDefaults)
                    that._onValueChange()
                }
            }],
        })

        super._config()
    }

    getValue() {
        const value = []
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i]
            if (field.getValue) {
                const fieldValue = field.getValue()
                value.push(fieldValue)
            }
        }

        return value
    }

    setValue(value) {
        if (Array.isArray(value)) {
            for (let i = 0; i < this.fields.length; i++) {
                const field = this.fields[i]
                if (field.setValue) {
                    field.setValue(value[i])
                }
            }
        }
    }
}

Component.register(GroupList)

export default GroupList
