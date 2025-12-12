
// 图片配置表 (Image Configuration)
// ==========================================
// 💡 如何更换 GIF？
//
// 方式 A：使用网络链接 (推荐)
//    直接把引号里的内容换成 http 开头的网址。
//
// 方式 B：使用本地文件 (My file is local)
//    1. 把你的 GIF 文件复制到项目文件夹中 (和 index.html 在一起)。
//    2. 将链接改成文件名，例如: './my-stomach-pain.gif'
// ==========================================

export const STANDARD_ILLUSTRATION_URLS: Record<string, string> = {
  // === 消化系统 (Digestive) ===
  
  // 1. 胃炎 / 胃痛 / 消化不良
  // 示例：如果你把一个叫 stomach.gif 的文件放在了项目根目录，就写成这样：
  // GASTRITIS: './stomach.gif', 
  GASTRITIS: '', 
  
  // 2. 胃食管反流 (烧心 / 反酸)
  REFLUX: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWk0Mmw5d3gyYmc2cDQ5cmNza29lZ3dxY2U2OGp3NW8wMWNoNWY5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HsQ5wYKCT88ysaLqbx/giphy.gif',

  // === 您的新请求 (请在引号中粘贴 GIF 链接) ===
  
  // 急性胰腺炎.gif
  PANCREATITIS: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXgwbmk1eWlkbG05cWwzcXFjcmtscXB4YTdqc3h1OXpnbDFxYXdtNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AkOeJX1XDNKjLBVHVt/giphy.gif',    

  // 胆囊息肉.gif
  GALLBLADDER_POLYPS: 'https://media.giphy.com/media/P7cfWwcSXK2pq4Igc5/giphy.gif',   

  // 肝硬化.gif
  CIRRHOSIS: 'https://media.giphy.com/media/GFA8yQ3OmtNvE3jjb9/giphy.gif',

  // 毛囊炎.gif (皮肤问题)
  FOLLICULITIS: 'https://media.giphy.com/media/JRVICuUiyzabq2Pn8T/giphy.gif',

  // === 其他预留位置 ===
  APPENDICITIS: '',    // 阑尾肿胀
  CHOLECYSTITIS: '',   // 胆囊炎
  COLITIS: '',         // 结肠炎
  UTI: '',             // 尿路感染
  TENSION_HEADACHE: '', // 紧张性头痛
};
