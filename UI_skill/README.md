# UI Skill 总入口

这个文件夹用于记录本项目在 Figma 与 UI 设计中的约定，范围不只包括图层整理，也包括设计语言、命名、页面状态、图标与组件使用方式。

## 文件结构

- `layout_and_layers.md`  
  图层结构、分组方式、页面区域拆分

- `naming.md`  
  Frame、Group、Section、组件图层的命名习惯

- `states_and_annotations.md`  
  多状态页面、滚动页面、上下帧关系备注

- `design_language.md`  
  页面气质、视觉克制度、信息层级、文案方向

- `components_and_icons.md`  
  返回按钮、图标、动作区、可复用控件的约定

- `screen_patterns.md`  
  主界面、Feature、Personal、Settings、Sense 等页面类型的用途、状态和推荐结构

## 使用方式

后续如果需要新增规则：

- 属于“怎么分组、怎么摆层级”的，写进 `layout_and_layers.md`
- 属于“叫什么名字”的，写进 `naming.md`
- 属于“同一页面多个状态怎么表达”的，写进 `states_and_annotations.md`
- 属于“这个项目整体看起来应该是什么感觉”的，写进 `design_language.md`
- 属于“图标、按钮、动作区怎么处理”的，写进 `components_and_icons.md`
- 属于“这一类页面是什么、有哪些状态、以后应该怎么继续长”的，写进 `screen_patterns.md`

如果一条规则同时涉及多个方面，先写在最核心的那一类文件里，再在其它文件里做简短引用，避免重复膨胀。

## 与 `MAP_SPEC` 的关系

`MAP_SPEC` 是当前项目的总纲，用于定义项目定位、核心问题、状态层、视觉映射和交互本意。  
`UI_skill/` 记录的是在当前设计过程中逐步沉淀出的执行规则。

如果两者出现冲突：

- 先回到 `MAP_SPEC` 判断是否偏离项目本意
- `UI_skill/` 需要服从 `MAP_SPEC`
- 局部页面的漂亮或便利，不能覆盖总纲里已经确定的核心逻辑
