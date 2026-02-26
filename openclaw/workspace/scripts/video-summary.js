#!/usr/bin/env node
/**
 * 视频总结脚本 v2
 * 支持 YouTube 和 Bilibili 视频
 * 使用多种方法获取视频信息
 */

const VIDEO_PATTERNS = {
  youtube: [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ],
  bilibili: [
    /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/,
    /(?:https?:\/\/)?b23\.tv\/([a-zA-Z0-9]+)/,
  ]
};

/**
 * 从 URL 提取视频 ID
 */
function extractVideoId(url, platform) {
  const patterns = VIDEO_PATTERNS[platform];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * 检测视频平台
 */
function detectPlatform(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('bilibili.com') || url.includes('b23.tv')) {
    return 'bilibili';
  }
  return null;
}

/**
 * 获取 YouTube 视频信息
 */
async function getYouTubeInfo(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  // 方法 1: 尝试使用 invidious（开源 YouTube 前端）
  const invidiousInstances = [
    'https://vid.puffyan.us',
    'https://yewtu.be',
    'https://invidious.kavin.rocks',
  ];

  for (const instance of invidiousInstances) {
    try {
      const apiUrl = `${instance}/api/v1/videos/${videoId}`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        return {
          title: data.title || '无标题',
          views: data.viewCount ? `${data.viewCount.toLocaleString()} views` : '',
          time: data.published ? new Date(data.published * 1000).toLocaleDateString('zh-CN') : '',
          description: data.description || '无描述',
          url,
          duration: data.lengthSeconds ? `${Math.floor(data.lengthSeconds / 60)}:${(data.lengthSeconds % 60).toString().padStart(2, '0')}` : '',
          author: data.author || ''
        };
      }
    } catch (error) {
      continue; // 尝试下一个实例
    }
  }

  // 方法 2: 使用 jina.ai（备选）
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(jinaUrl);
    const text = await response.text();
    const lines = text.split('\n');

    return {
      title: lines[0] || '无标题',
      views: lines.find(l => l.includes('views'))?.trim() || '',
      time: lines.find(l => /\d+ (years|months|days|hours|minutes|seconds) ago/.test(l))?.trim() || '',
      description: lines.slice(1, 50).join('\n').substring(0, 3000),
      url
    };
  } catch (error) {
    throw new Error('所有方法均失败');
  }
}

/**
 * 获取 Bilibili 视频信息
 */
async function getBilibiliInfo(videoId) {
  const url = `https://www.bilibili.com/video/${videoId}`;
  const jinaUrl = `https://r.jina.ai/${url}`;

  try {
    const response = await fetch(jinaUrl);
    const text = await response.text();
    const lines = text.split('\n');

    const title = lines[0] || '无标题';
    const views = lines.find(l => l.includes('播放'))?.trim() || '';
    const author = lines.find(l => l.includes('UP') || l.includes('作者'))?.trim() || '';

    // 找到主要内容（跳过导航栏）
    let descriptionStart = lines.findIndex(l => l.includes('---') || l.includes('简介') || l.includes('简介：'));
    if (descriptionStart < 0) descriptionStart = 5; // 默认跳过前几行

    const description = lines
      .slice(descriptionStart, descriptionStart + 50)
      .join('\n')
      .substring(0, 3000);

    return {
      title,
      views,
      author,
      description,
      url
    };
  } catch (error) {
    throw new Error(`获取 Bilibili 信息失败: ${error.message}`);
  }
}

/**
 * 主函数
 */
async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('❌ 错误: 请提供视频 URL');
    console.error('用法: node video-summary.js <视频URL>');
    process.exit(1);
  }

  const platform = detectPlatform(url);
  if (!platform) {
    console.error('❌ 错误: 不支持的视频平台');
    console.error('支持的平台: YouTube, Bilibili');
    process.exit(1);
  }

  const videoId = extractVideoId(url, platform);
  if (!videoId) {
    console.error('❌ 错误: 无法从 URL 提取视频 ID');
    process.exit(1);
  }

  console.log(`\n🎬 正在获取 ${platform.toUpperCase()} 视频信息...`);

  let info;
  try {
    if (platform === 'youtube') {
      info = await getYouTubeInfo(videoId);
    } else if (platform === 'bilibili') {
      info = await getBilibiliInfo(videoId);
    }

    console.log('\n✅ 视频信息获取成功！\n');
    console.log('='.repeat(60));
    console.log(`📺 标题: ${info.title}`);
    if (info.author) console.log(`👤 ${platform === 'youtube' ? '频道' : 'UP主'}: ${info.author}`);
    if (info.views) console.log(`👀 数据: ${info.views}`);
    if (info.duration) console.log(`⏱️  时长: ${info.duration}`);
    console.log(`🔗 链接: ${info.url}`);
    console.log('='.repeat(60));
    console.log('\n📝 描述内容:');
    console.log(info.description);
    console.log('\n' + '='.repeat(60));

    // 输出 JSON 格式（用于 AI 处理）
    console.log('\n---JSON_START---');
    console.log(JSON.stringify({
      platform,
      videoId,
      ...info
    }, null, 2));
    console.log('---JSON_END---\n');

  } catch (error) {
    console.error(`\n❌ 错误: ${error.message}`);
    console.error('💡 提示: 可能是网络问题或视频平台限制');
    process.exit(1);
  }
}

main().catch(console.error);
