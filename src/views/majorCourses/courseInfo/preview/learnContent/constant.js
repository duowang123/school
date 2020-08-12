export const CHAPTER_CONT_TYPE = {
  'daoxue': 'courseGuide',
  'shipin': 'teachVideo',
  'cailiao': 'courseMaterial',
  'ziyuan': 'courseExpandResource',
  'taolun': 'courseTopicDiscusses'
}

export const chapterKeyMap = {
  '导学': { key: 'courseGuide', cont: { courseType: '1', content: '', 'learnTimeHour': 0, 'learnTimeMin': 0, 'learnTimeSec': 0 }},
  '教学视频': { key: 'teachVideo', cont: { courseType: '2', content: '', 'learnTimeHour': 0, 'learnTimeMin': 0, 'learnTimeSec': 0 }},
  '学习材料': { key: 'courseMaterial', cont: { courseType: '3', content: '', 'learnTimeHour': 0, 'learnTimeMin': 0, 'learnTimeSec': 0 }},
  '拓展资源': { key: 'courseExpandResource', cont: { courseType: '4', content: '', 'learnTimeHour': 0, 'learnTimeMin': 0, 'learnTimeSec': 0 }},
  '主题讨论': { key: 'courseTopicDiscusses', cont: { topicIntroduce: '', topicName: '' }}
}
