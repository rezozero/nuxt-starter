import VMarkdown from '~/components/atoms/VMarkdown'

export default {
    title: 'atoms/Markdown',
    component: VMarkdown,
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        components: { VMarkdown },
        template: `
            <v-markdown v-bind="$props" />
        `,
    }
}

export const Default = Template.bind({})
Default.args = {
    content: `
# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes

> Je me suis rendue au Musée de l’Homme, et là, à ma grande surprise, on m’a sorti des enregistrements sur cylindres de cire de chants de l’Aurès captés dans les années 20 et 30 par des anthropologues, ethnologues, musicologues.
___
> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Lorem ipsum
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

\\
Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
    1. Sub item 1 Lorem ipsum dolor sit amet
    2. Sub item 2 Lorem ipsum dolor sit amet
3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
4. Integer molestie lorem at massa


## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](https://google.com)
[![img](https://via.placeholder.com/300x150)](https://google.com)

## IFrame

<iframe width="100%" src="https://www.youtube.com/embed/enMumwvLAug" frameborder="0" allowfullscreen="true"> </iframe>

`,
}
