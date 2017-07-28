# 笔记

### Bugs
commander@2.11.0展示help时格式有偏差。降级成@2.9.0

### consolidate
结合源码（真漂亮）、handlebars的文档一起看，理解consolidate.Handlebars和consolidate.Handlebars.render有何不同。

### metalsmith
`use(plugin)`有加载顺序，其他设置（除build、process）则会自动提升至顶层。

### handlebars
- `#var`相当于`#if var`
- `^var`相当于`#unless var`
