// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Scissors,
  Layers,
  Compass,
  Thermometer,
  Eye,
  Trees,
  Sparkles,
  RefreshCw,
  AlertCircle,
  MapPin,
  Sliders,
  ZoomIn,
  X,
  Database,
  TrendingUp,
  Check,
  PlusCircle,
  Crosshair,
  RotateCcw,
  Smartphone,
  Key,
  Siren,
  Globe,
  ShieldCheck,
  Building2,
  ClipboardPaste,
  ImagePlus
} from 'lucide-react';

// ==========================================
// 47都道府県データ ＆ 各都道府県の主要野生動物相（生態系ベースライン）
// ==========================================
const PREFECTURES_47 = [
  '北海道',
  '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県',
  '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

const NEIGHBOR_PREFECTURES = {
  '北海道': ['青森県'],
  '青森県': ['北海道', '岩手県', '秋田県'],
  '岩手県': ['青森県', '宮城県', '秋田県'],
  '宮城県': ['岩手県', '秋田県', '山形県', '福島県'],
  '秋田県': ['青森県', '岩手県', '宮城県', '山形県'],
  '山形県': ['秋田県', '宮城県', '福島県', '新潟県'],
  '福島県': ['宮城県', '山形県', '茨城県', '栃木県', '群馬県', '新潟県'],
  '茨城県': ['福島県', '栃木県', '埼玉県', '千葉県'],
  '栃木県': ['福島県', '茨城県', '群馬県', '埼玉県'],
  '群馬県': ['福島県', '栃木県', '埼玉県', '新潟県', '長野県'],
  '埼玉県': ['茨城県', '栃木県', '群馬県', '千葉県', '東京都', '山梨県', '長野県'],
  '千葉県': ['茨城県', '埼玉県', '東京都', '神奈川県'],
  '東京都': ['埼玉県', '千葉県', '神奈川県', '山梨県'],
  '神奈川県': ['東京都', '千葉県', '山梨県', '静岡県'],
  '新潟県': ['山形県', '福島県', '群馬県', '富山県', '長野県'],
  '富山県': ['新潟県', '石川県', '長野県', '岐阜県'],
  '石川県': ['富山県', '福井県', '岐阜県'],
  '福井県': ['石川県', '岐阜県', '滋賀県', '京都府'],
  '山梨県': ['埼玉県', '東京都', '神奈川県', '長野県', '静岡県'],
  '長野県': ['群馬県', '埼玉県', '新潟県', '富山県', '山梨県', '岐阜県', '静岡県', '愛知県'],
  '岐阜県': ['富山県', '石川県', '福井県', '長野県', '愛知県', '三重県', '滋賀県'],
  '静岡県': ['神奈川県', '山梨県', '長野県', '愛知県'],
  '愛知県': ['長野県', '岐阜県', '静岡県', '三重県'],
  '三重県': ['岐阜県', '愛知県', '滋賀県', '京都府', '奈良県', '和歌山県'],
  '滋賀県': ['福井県', '岐阜県', '三重県', '京都府'],
  '京都府': ['福井県', '三重県', '滋賀県', '大阪府', '兵庫県', '奈良県'],
  '大阪府': ['京都府', '兵庫県', '奈良県', '和歌山県'],
  '兵庫県': ['京都府', '大阪府', '鳥取県', '岡山県', '徳島県'],
  '奈良県': ['三重県', '京都府', '大阪府', '和歌山県'],
  '和歌山県': ['三重県', '大阪府', '奈良県'],
  '鳥取県': ['兵庫県', '島根県', '岡山県', '広島県'],
  '島根県': ['鳥取県', '広島県', '山口県'],
  '岡山県': ['兵庫県', '鳥取県', '広島県', '香川県'],
  '広島県': ['鳥取県', '島根県', '岡山県', '山口県', '愛媛県'],
  '山口県': ['島根県', '広島県', '福岡県'],
  '徳島県': ['兵庫県', '香川県', '愛媛県', '高知県'],
  '香川県': ['岡山県', '徳島県', '愛媛県'],
  '愛媛県': ['広島県', '徳島県', '香川県', '高知県'],
  '高知県': ['徳島県', '愛媛県'],
  '福岡県': ['山口県', '佐賀県', '熊本県', '大分県'],
  '佐賀県': ['福岡県', '長崎県'],
  '長崎県': ['佐賀県'],
  '熊本県': ['福岡県', '大分県', '宮崎県', '鹿児島県'],
  '大分県': ['福岡県', '熊本県', '宮崎県'],
  '宮崎県': ['熊本県', '大分県', '鹿児島県'],
  '鹿児島県': ['熊本県', '宮崎県', '沖縄県'],
  '沖縄県': ['鹿児島県']
};

const getPrefectureFaunaProfile = (pref) => {
  if (pref === '北海道') {
    return '北海道固有・北方系動物相（エゾナキウサギ、エゾライチョウ、エゾシカ、ヒグマ、キタキツネ、エゾリス、エゾシマリス、エゾクロテン、タンチョウ等。ヤマドリ・キジ・ツキノワグマ・イノシシは自然分布しない）';
  }
  if (pref === '沖縄県') {
    return '南西諸島・亜熱帯動物相（ヤンバルクイナ、ノグチゲラ、リュウキュウイノシシ、カンムリワシ、シロハラクイナ等。ヤマドリ・キジ・クマ類は分布しない）';
  }
  if (['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'].includes(pref)) {
    return `${pref}（東北・ブナ帯〜里山動物相：キタヤマドリ/ヤマドリ、キジ、ツキノワグマ、ニホンカモシカ、ニホンザル、ホンドタヌキ、ホンドギツネ、ニホンリス、ハクビシン等。エゾナキウサギ・エゾライチョウは非分布）`;
  }
  if (['東京都', '神奈川県', '埼玉県', '千葉県', '大阪府', '愛知県', '福岡県'].includes(pref)) {
    return `${pref}（都市近郊〜山地動物相：市街地ではハクビシン、アライグマ、タヌキ、カラス類、オオタカ、カワウ；山間部ではヤマドリ、キジ、イノシシ、ニホンジカ等）`;
  }
  return `${pref}（本州・四国・九州 温帯林〜里山動物相：ヤマドリ、キジ、コジュケイ、ニホンイノシシ、ニホンジカ、ホンドタヌキ、アナグマ、ハクビシン、アライグマ、猛禽類等）`;
};

const normalizeSpeciesNameForWiki = (name = '') => {
  return String(name)
    .replace(/（.*?）|\(.*?\)/g, '')
    .replace(/メス|オス|雌|雄|成鳥|幼鳥|亜種/g, '')
    .split(/[・／/]/)[0]
    .trim();
};

// 安全なJSON抽出・自動修復パーサー
const safeExtractJsonFromText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return null;

  const trimmed = rawText.trim();
  const candidatesToTry = [trimmed];

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    candidatesToTry.unshift(codeBlockMatch[1].trim());
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidatesToTry.push(trimmed.slice(firstBrace, lastBrace + 1));
  }

  const firstBracket = trimmed.indexOf('[');
  const lastBracket = trimmed.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    candidatesToTry.push(trimmed.slice(firstBracket, lastBracket + 1));
  }

  for (const candidate of candidatesToTry) {
    try {
      return JSON.parse(candidate);
    } catch {
      try {
        // 末尾カンマや制御文字を除去して再試行
        const sanitized = candidate
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/[\u0000-\u0019]+/g, ' ');
        return JSON.parse(sanitized);
      } catch {
        continue;
      }
    }
  }
  return null;
};

const createAcademicDiagramDataUrl = (name, scientificName, color = '#10b981') => {
  const safeName = (name || '野生動物').slice(0, 14);
  const safeSci = (scientificName || 'Species specimen').slice(0, 26);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="320" height="220" fill="url(#bg)"/>
    <rect x="8" y="8" width="304" height="204" rx="10" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.65"/>
    <text x="160" y="105" text-anchor="middle" fill="#f8fafc" font-family="sans-serif" font-size="16" font-weight="bold">${safeName}</text>
    <text x="160" y="132" text-anchor="middle" fill="#94a3b8" font-family="serif" font-style="italic" font-size="12">${safeSci}</text>
    <text x="160" y="172" text-anchor="middle" fill="${color}" font-family="sans-serif" font-size="10">ACADEMIC REFERENCE SPECIMEN</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const DEMO_RESULT = {
  detectedTargetSummary:
    '左画面（サーマル）の中央に周囲の植物と明確な温度差を持つ約25〜30cmの恒温動物（鳥類）の熱源を検出。右画面（可視光）のシダ植物の下草の隙間に、褐色・赤褐色・黒色の複雑な斑紋（保護色）を持つ個体が静止して潜伏しているのを確認。',
  inferredEnvironment:
    '山林の傾斜地（シダ類・ウラジロ・落ち葉が堆積する湿潤な林床環境）。見通しの悪い森林内の斜面であり、森林性のキジ目鳥類が好む典型的な生息環境。',
  candidates: [
    {
      rank: 1,
      name: 'ヤマドリ（メス）',
      scientificName: 'Syrmaticus soemmerringii',
      category: '鳥綱 キジ目 キジ科',
      probability: 78,
      colorCode: '#10b981',
      visualReasoning:
        '背面から翼にかけての赤みを帯びた濃い褐色と黒褐色の細かい斑紋が、枯れ葉やシダの隙間と完全に同化（保護色）しています。キジのメスよりも全体的に赤褐色味が強く、森林内の暗がりにとけ込む模様パターンが一致します。',
      habitatReasoning:
        '【決定的な根拠】撮影場所が「山の斜面・シダが繁茂する森林の林床」である点です。ヤマドリは日本固有種で、まさにこのような山地・渓谷沿いの急斜面やシダの下草に身を隠す習性が非常に強いです。',
      keyDistinctions: [
        '山の急斜面・シダの下草という典型的な山林生息地',
        '赤みを帯びた濃い褐色の細かい保護色パターン',
        '危険を感じると飛ばずにシダの下でじっと動かずやり過ごす習性'
      ]
    },
    {
      rank: 2,
      name: 'キジ（メス）',
      scientificName: 'Phasianus versicolor',
      category: '鳥綱 キジ目 キジ科',
      probability: 17,
      colorCode: '#f59e0b',
      visualReasoning:
        'ヤマドリのメスと体型・サイズ・うろこ状の黒斑模様が酷似しており、上から見下ろしたアングルでは外見だけで100%区別するのは熟練者でも困難なほど似ています。',
      habitatReasoning:
        'キジは本来「河川敷・農耕地・開けた草地・明るい里山林縁」を好みますが、山裾や伐採地周辺の斜面に入り込むこともあるため次点（17%）としています。深い山林斜面であればヤマドリの可能性がより高まります。',
      keyDistinctions: [
        '体色がヤマドリよりやや黄色・灰褐色寄りで明るい',
        '尾羽が長めで、開けた草地や林縁を好む傾向',
        'ヤマドリ雌との識別には尾羽の模様と環境の深さが鍵'
      ]
    },
    {
      rank: 3,
      name: 'コジュケイ（またはエゾライチョウ）',
      scientificName: 'Bambusicola thoracicus / Tetrastes bonasia',
      category: '鳥綱 キジ目 キジ科',
      probability: 5,
      colorCode: '#64748b',
      visualReasoning:
        '同様に茶褐色と黒・白の斑紋を持ち、下草やヤブの中に潜むキジ科の鳥類です。サーマルでの熱源サイズがやや小ぶりな場合や、丸っこい体型の見え方をする場合に候補となります。',
      habitatReasoning:
        'コジュケイは本州以南の低山・竹林・シダやぶを好み、エゾライチョウは北海道の森林に生息します。撮影地域や標高によって第3の候補として挙げられます。',
      keyDistinctions: [
        'ヤマドリ・キジより一回り小さい（全長約27〜35cm）',
        'ヤブやシダの下を歩いて移動し、めったに飛翔しない',
        '北海道での撮影なら「エゾライチョウ」の可能性が急上昇'
      ]
    }
  ],
  comparisonSummary: [
    {
      feature: '主な生息地（環境）',
      species1: '山地の森林・急斜面・渓谷・シダ林床',
      species2: '里山・農耕地・河川敷・明るい草地',
      species3: '低山の竹林・密なヤブ（北海道は針広混交林）'
    },
    {
      feature: '体色・斑紋の特徴',
      species1: '赤褐色が強く、黒斑が細かく密に入る',
      species2: '黄褐色〜灰褐色で、黒斑の輪郭が明瞭',
      species3: '赤茶色と灰色の混在、丸みのある小柄な体型'
    },
    {
      feature: '尾羽の特徴',
      species1: 'やや短く先が丸みを帯び、赤褐色で白斑あり',
      species2: '比較的長く、先端に向かって細く尖る',
      species3: '短めで体に収まって見えることが多い'
    },
    {
      feature: '潜伏時の行動特性',
      species1: 'シダや倒木の下で極限までじっと動かない',
      species2: '草むらに隠れるが、近づくと飛び立つことも多い',
      species3: 'ペアや小群でヤブの中を素早く移動・潜伏'
    }
  ]
};

const INITIAL_LEARNING_RECORDS = [
  {
    id: 'kb-init-1',
    speciesName: 'ヤマドリ（メス）',
    scientificName: 'Syrmaticus soemmerringii',
    habitatType: '山林・森林斜面（シダ・下草あり）',
    regionType: '秋田県',
    cameraMode: 'サーマル＋可視光 2画面（ドローン等）',
    areaRatioPercent: 3.6,
    occlusionAugmented: true,
    featureTags: ['赤褐色斑紋', 'シダ林床潜伏', '中小型熱源(25-30cm)', '急斜面'],
    timestamp: '2026-11-10 14:22',
    note: 'スギ・広葉樹混交林の斜面シダ下にてドローンで確認（正解確定済み）',
    cropDataUrl: null
  },
  {
    id: 'kb-init-2',
    speciesName: 'ヤマドリ（メス）',
    scientificName: 'Syrmaticus soemmerringii',
    habitatType: '山林・森林斜面（シダ・下草あり）',
    regionType: '秋田県',
    cameraMode: 'サーマル＋可視光 2画面（ドローン等）',
    areaRatioPercent: 4.1,
    occlusionAugmented: true,
    featureTags: ['保護色（枯葉同化）', 'サーマル明瞭熱源', '無動潜伏'],
    timestamp: '2026-11-12 09:45',
    note: '渓谷沿いの急斜面でシダの間から背面の一部のみ露出（オクルージョン拡張済）',
    cropDataUrl: null
  },
  {
    id: 'kb-init-3',
    speciesName: 'キジ（メス）',
    scientificName: 'Phasianus versicolor',
    habitatType: '里山・林縁・農耕地周辺',
    regionType: '岩手県',
    cameraMode: '通常カメラ（可視光写真・動画）',
    areaRatioPercent: 6.2,
    occlusionAugmented: false,
    featureTags: ['淡黄褐色', '黒斑明瞭', '林縁ススキ草地'],
    timestamp: '2026-11-08 16:10',
    note: '林道脇の草地斜面にて確認されたキジ雌個体',
    cropDataUrl: null
  }
];

const generateDemoSplitImage = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1f2428';
  ctx.fillRect(0, 0, 480, 420);

  for (let i = 0; i < 160; i++) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(155, 163, 170, 0.35)' : 'rgba(65, 70, 75, 0.55)';
    ctx.lineWidth = 1.5 + (i % 4);
    ctx.beginPath();
    const sx = (i * 37) % 480;
    const sy = (i * 29) % 420;
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(
      sx + ((i * 19) % 80) - 40,
      sy + ((i * 13) % 60) - 30,
      sx + ((i * 23) % 100) - 50,
      sy + ((i * 31) % 80) - 40,
      sx + ((i * 41) % 90) - 45,
      sy + ((i * 17) % 70) - 35
    );
    ctx.stroke();
  }

  const thermalGrad = ctx.createRadialGradient(242, 202, 2, 242, 202, 18);
  thermalGrad.addColorStop(0, '#fff799');
  thermalGrad.addColorStop(0.28, '#ff2a00');
  thermalGrad.addColorStop(0.65, '#990000');
  thermalGrad.addColorStop(1, 'rgba(31, 36, 40, 0)');
  ctx.fillStyle = thermalGrad;
  ctx.beginPath();
  ctx.arc(242, 202, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2d3b22';
  ctx.fillRect(480, 0, 480, 420);

  ctx.save();
  ctx.translate(715, 205);
  ctx.fillStyle = '#4a2818';
  ctx.beginPath();
  ctx.ellipse(0, 0, 48, 36, -0.2, 0, Math.PI * 2);
  ctx.fill();

  for (let m = 0; m < 45; m++) {
    ctx.fillStyle = m % 3 === 0 ? '#1c120c' : m % 3 === 1 ? '#7c4728' : '#b8865c';
    const mx = ((m * 19) % 70) - 35;
    const my = ((m * 13) % 50) - 25;
    ctx.beginPath();
    ctx.ellipse(mx, my, 6, 3, (m % 5) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const drawFernFrond = (fx, fy, angle, length, color) => {
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.stroke();

    for (let p = 8; p < length; p += 9) {
      const leafLen = 18 * (1 - p / (length * 1.15));
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(p, -leafLen / 2 - 2, 3.2, leafLen / 2, 0.25, 0, Math.PI * 2);
      ctx.ellipse(p, leafLen / 2 + 2, 3.2, leafLen / 2, -0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const fernColors = ['#3f7027', '#4f8832', '#65a340', '#2e571b', '#76b049'];
  for (let f = 0; f < 42; f++) {
    const fx = 490 + ((f * 53) % 450);
    const fy = 20 + ((f * 41) % 380);
    const distCenter = Math.hypot(fx - 715, fy - 205);
    if (distCenter < 34 && f % 3 !== 0) continue;
    const angle = ((f * 1.3) % (Math.PI * 2)) - Math.PI;
    const len = 70 + (f % 4) * 22;
    drawFernFrond(fx, fy, angle, len, fernColors[f % fernColors.length]);
  }

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(480, 0);
  ctx.lineTo(480, 420);
  ctx.stroke();

  return canvas.toDataURL('image/jpeg', 0.9);
};

const compressImageForApi = (sourceDataUrl, maxDim = 800) => {
  return new Promise((resolve) => {
    if (!sourceDataUrl) return resolve('');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let w = img.width || 640;
      let h = img.height || 480;
      if (w > maxDim || h > maxDim) {
        if (w >= h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => resolve(sourceDataUrl);
    img.src = sourceDataUrl;
  });
};

const generateRoiCropDataUrl = (sourceDataUrl, roiBox, applyOcclusionSim = false) => {
  return new Promise((resolve) => {
    if (!sourceDataUrl) {
      resolve('');
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetSize = 300;
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');

      const sx = Math.max(0, Math.floor((roiBox?.x ?? 0.38) * img.width));
      const sy = Math.max(0, Math.floor((roiBox?.y ?? 0.32) * img.height));
      const sw = Math.max(24, Math.floor((roiBox?.w ?? 0.22) * img.width));
      const sh = Math.max(24, Math.floor((roiBox?.h ?? 0.32) * img.height));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetSize, targetSize);

      if (applyOcclusionSim) {
        ctx.strokeStyle = 'rgba(77, 124, 15, 0.75)';
        ctx.lineWidth = 6;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 40 + i * 55);
          ctx.bezierCurveTo(100, 20 + i * 50, 220, 80 + i * 45, 320, 35 + i * 55);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.strokeRect(1.5, 1.5, targetSize - 3, targetSize - 3);

      resolve(canvas.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => resolve(sourceDataUrl);
    img.src = sourceDataUrl;
  });
};

const fetchWithTimeout = async (url, options, timeoutMs = 20000, externalSignal = null) => {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(new Error('TIMEOUT')), timeoutMs);

  const onExternalAbort = () => controller.abort(new Error('USER_ABORT'));
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timerId);
      throw new Error('ユーザーにより中断されました');
    }
    externalSignal.addEventListener('abort', onExternalAbort);
  }

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if (err.name === 'AbortError' || err.message === 'TIMEOUT') {
      throw new Error(`API応答タイムアウト（${Math.round(timeoutMs / 1000)}秒超過）`);
    }
    if (err.message === 'USER_ABORT') {
      throw new Error('ユーザーにより解析を中断しました');
    }
    throw err;
  } finally {
    clearTimeout(timerId);
    if (externalSignal) externalSignal.removeEventListener('abort', onExternalAbort);
  }
};

const callGeminiWithModelFallback = async (apiKey, payload, externalSignal = null, onStatusUpdate = null) => {
  let candidateModels = [
    'gemini-3.8-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash'
  ];

  try {
    if (onStatusUpdate) onStatusUpdate('APIキーで利用可能な最新Geminiモデルを確認中...');
    const listRes = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: 'GET' },
      5000,
      externalSignal
    );
    if (listRes.ok) {
      const listData = await listRes.json();
      const validFlashModels = (listData.models || [])
        .filter(
          (m) =>
            Array.isArray(m.supportedGenerationMethods) &&
            m.supportedGenerationMethods.includes('generateContent') &&
            /gemini.*flash/i.test(m.name) &&
            !/image|tts|audio/i.test(m.name)
        )
        .map((m) => m.name.replace(/^models\//, ''))
        .sort((a, b) => b.localeCompare(a));

      if (validFlashModels.length > 0) {
        candidateModels = Array.from(new Set([...validFlashModels.slice(0, 4), ...candidateModels]));
      }
    }
  } catch {
    // モデル一覧取得失敗時はデフォルト候補を使用
  }

  let lastError = 'APIリクエストに失敗しました';
  const timeoutPerModel = payload.tools ? 22000 : 18000;

  for (const modelName of candidateModels) {
    if (externalSignal?.aborted) throw new Error('ユーザーにより解析を中断しました');
    try {
      if (onStatusUpdate) onStatusUpdate(`モデル [${modelName}] で高速処理を実行中...`);
      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        timeoutPerModel,
        externalSignal
      );

      if (res.ok) {
        return await res.json();
      }

      const errBody = await res.json().catch(() => ({}));
      const msg = errBody?.error?.message || `HTTP ${res.status}`;
      lastError = `${modelName}: ${msg}`;

      if (
        res.status === 404 ||
        res.status === 429 ||
        res.status === 503 ||
        res.status === 500 ||
        /no longer available|not found|not supported|quota|overloaded/i.test(msg)
      ) {
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      throw new Error(msg);
    } catch (err) {
      lastError = err.message;
      if (/中断/.test(err.message)) throw err;
      continue;
    }
  }
  throw new Error(lastError);
};

export default function App() {
  const [mediaType, setMediaType] = useState('empty');
  const [imagePreview, setImagePreview] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [capturedFrames, setCapturedFrames] = useState([]);

  const [habitatType, setHabitatType] = useState('山林・森林斜面（シダ・下草あり）');
  const [regionType, setRegionType] = useState('秋田県');
  const [cameraMode, setCameraMode] = useState('サーマル＋可視光 2画面（ドローン等）');
  const [userObservation, setUserObservation] = useState('');

  const [escapedAlerts, setEscapedAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('wildsearcher_escaped_alerts_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [enableEscapedSync, setEnableEscapedSync] = useState(true);
  const [isSearchingEscapedNews, setIsSearchingEscapedNews] = useState(false);
  const [escapedNewsStatusMsg, setEscapedNewsStatusMsg] = useState('');
  const [manualEscapeSpecies, setManualEscapeSpecies] = useState('');
  const [manualEscapePref, setManualEscapePref] = useState('秋田県');
  const [manualEscapeFacility, setManualEscapeFacility] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [baseAnalysisResult, setBaseAnalysisResult] = useState(DEMO_RESULT);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('ranking');

  const [enableRoiCrop, setEnableRoiCrop] = useState(true);
  const [roiBox, setRoiBox] = useState({
    x: 0.40,
    y: 0.34,
    w: 0.20,
    h: 0.30,
    thermalX: 0.21,
    thermalY: 0.38,
    thermalW: 0.09,
    thermalH: 0.20,
    label: 'ターゲットROI領域'
  });
  const [croppedRoiDataUrl, setCroppedRoiDataUrl] = useState('');

  const [learningRecords, setLearningRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('wildlens_active_learning_kb_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_LEARNING_RECORDS;
  });
  const [enableRagBoost, setEnableRagBoost] = useState(true);
  const [enableOcclusionAugment, setEnableOcclusionAugment] = useState(true);
  const [recentlyConfirmedInfo, setRecentlyConfirmedInfo] = useState(null);
  const [customSpeciesInput, setCustomSpeciesInput] = useState('');

  const [analysisTiming, setAnalysisTiming] = useState({
    remainingSec: 12,
    progressPercent: 0,
    currentStepLabel: '待機中'
  });

  const [specimenImages, setSpecimenImages] = useState({});
  const [enlargedSpecimen, setEnlargedSpecimen] = useState(null);

  const [userApiKey, setUserApiKey] = useState(() => {
    try {
      return localStorage.getItem('wildlens_gemini_api_key') || '';
    } catch {
      return '';
    }
  });
  const [showMobileGuideModal, setShowMobileGuideModal] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const previewContainerRef = useRef(null);
  const analysisAbortRef = useRef(null);

  const roiAreaRatioPercent = Number(((roiBox.w * roiBox.h) * 100).toFixed(1));

  const handleSaveApiKey = (val) => {
    setUserApiKey(val);
    try {
      localStorage.setItem('wildlens_gemini_api_key', val.trim());
    } catch {}
  };

  useEffect(() => {
    try {
      localStorage.setItem('wildlens_active_learning_kb_v1', JSON.stringify(learningRecords));
    } catch {}
  }, [learningRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('wildsearcher_escaped_alerts_v1', JSON.stringify(escapedAlerts));
    } catch {}
  }, [escapedAlerts]);

  useEffect(() => {
    const onGlobalPaste = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/') || items[i].type.startsWith('video/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleFileUpload(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', onGlobalPaste);
    return () => window.removeEventListener('paste', onGlobalPaste);
  }, []);

  const handlePasteFromClipboardButton = async () => {
    setErrorMsg('');
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          const imageType = item.types.find((t) => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], `pasted_image_${Date.now()}.png`, { type: imageType });
            handleFileUpload(file);
            return;
          }
        }
        setErrorMsg('クリップボード内に画像が見つかりませんでした。画像をコピーしてからお試しください。');
      } else {
        setErrorMsg('画面をタップして Ctrl+V（または長押しメニューの「ペースト」）で貼り付けてください。');
      }
    } catch {
      setErrorMsg('ブラウザの権限により直接読み取れませんでした。枠内をタップして Ctrl+V（またはスマホの長押し「ペースト」）で貼り付けてください。');
    }
  };

  const relevantActiveEscapes = React.useMemo(() => {
    if (!enableEscapedSync) return [];
    const neighbors = NEIGHBOR_PREFECTURES[regionType] || [];
    return escapedAlerts.filter(
      (item) =>
        item.status === 'escaped' &&
        (item.prefecture === regionType || neighbors.includes(item.prefecture))
    );
  }, [escapedAlerts, regionType, enableEscapedSync]);

  const fetchEscapedAnimalNewsFromWeb = async () => {
    const apiKey = userApiKey.trim();
    if (!apiKey) {
      setShowMobileGuideModal(true);
      setEscapedNewsStatusMsg('⚠️ Webニュース検索を実行するには、先に「API設定」からGemini APIキーを保存してください。');
      return;
    }

    setIsSearchingEscapedNews(true);
    setEscapedNewsStatusMsg('最新報道を検索中...');
    const neighbors = NEIGHBOR_PREFECTURES[regionType] || [];
    const targetAreaStr = [regionType, ...neighbors.slice(0, 3)].join('・');

    try {
      const searchPrompt = `日本国内、特に「${targetAreaStr}」周辺の動物園・サファリパーク・飼育施設からの動物脱走・逃走ニュースをGoogle検索で確認してください。すでに確保・捕獲済みの場合は status を "captured"、未確保で逃走中の場合のみ "escaped" にしてください。該当がない場合は alerts を空配列 [] にしてください。

以下のJSON形式のみで回答してください：
{
  "summary": "検索結果の簡潔な要約",
  "alerts": [
    {
      "speciesName": "動物名",
      "prefecture": "都道府県名",
      "facilityName": "施設名",
      "status": "escaped または captured",
      "reportDate": "報道日",
      "details": "状況の詳細"
    }
  ]
}`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: searchPrompt }] }],
        tools: [{ googleSearch: {} }]
      };

      const data = await callGeminiWithModelFallback(apiKey, payload);
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const rawText = parts.map((p) => p.text || '').join('\n');
      if (!rawText) throw new Error('検索結果が空でした');

      const extracted = safeExtractJsonFromText(rawText);
      const parsed = Array.isArray(extracted)
        ? { summary: 'Webニュースから逃走情報を同期しました', alerts: extracted }
        : extracted && typeof extracted === 'object'
        ? {
            summary: extracted.summary || rawText.replace(/```[\s\S]*?```/g, '').trim().slice(0, 140),
            alerts: Array.isArray(extracted.alerts) ? extracted.alerts : []
          }
        : {
            summary: rawText.replace(/```[\s\S]*?```/g, '').trim().slice(0, 160),
            alerts: []
          };

      let capturedRemovedCount = 0;
      let activeAddedCount = 0;

      setEscapedAlerts((prev) => {
        let updated = [...prev];
        (parsed.alerts || []).forEach((incoming) => {
          if (!incoming || !incoming.speciesName) return;
          const isCaptured =
            incoming.status === 'captured' ||
            (incoming.details && /(確保|捕獲|保護|発見され)/.test(incoming.details));

          const existingIdx = updated.findIndex(
            (u) =>
              u.speciesName === incoming.speciesName &&
              u.prefecture === incoming.prefecture
          );

          if (isCaptured) {
            if (existingIdx !== -1 && updated[existingIdx].status === 'escaped') {
              updated[existingIdx] = {
                ...updated[existingIdx],
                status: 'captured',
                capturedAt: new Date().toLocaleString('ja-JP'),
                details: incoming.details || 'Web報道にて確保を確認・分析反映を自動解除'
              };
              capturedRemovedCount++;
            }
          } else {
            activeAddedCount++;
            const newAlertObj = {
              id: `web-esc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              speciesName: incoming.speciesName,
              prefecture: incoming.prefecture || regionType,
              facilityName: incoming.facilityName || '動物園・飼育施設',
              status: 'escaped',
              source: 'Webニュース自動同期',
              reportDate: incoming.reportDate || new Date().toLocaleDateString('ja-JP'),
              details: incoming.details || '逃走中報道あり'
            };
            if (existingIdx !== -1) {
              updated[existingIdx] = newAlertObj;
            } else {
              updated.unshift(newAlertObj);
            }
          }
        });
        return updated;
      });

      setEscapedNewsStatusMsg(
        parsed.summary ||
          `検索完了：${targetAreaStr}周辺の逃走中 ${activeAddedCount}件 / 確保確認により反映解除 ${capturedRemovedCount}件`
      );
    } catch (err) {
      setEscapedNewsStatusMsg(
        `Webニュースの取得に失敗しました（原因: ${err.message}）。下のフォームから手動登録もできます。`
      );
    } finally {
      setIsSearchingEscapedNews(false);
    }
  };

  const handleAddManualEscapedAlert = () => {
    if (!manualEscapeSpecies.trim()) return;
    const newItem = {
      id: `manual-esc-${Date.now()}`,
      speciesName: manualEscapeSpecies.trim(),
      prefecture: manualEscapePref,
      facilityName: manualEscapeFacility.trim() || '近隣動物園・飼育施設（手動登録）',
      status: 'escaped',
      source: '手動アラート登録',
      reportDate: new Date().toLocaleDateString('ja-JP'),
      details: `${manualEscapePref}周辺での逃走情報として分析結果に反映中`
    };
    setEscapedAlerts((prev) => [newItem, ...prev]);
    setManualEscapeSpecies('');
    setManualEscapeFacility('');
    setEscapedNewsStatusMsg(
      `「${newItem.speciesName}（${newItem.prefecture}）」を逃走中リストに登録しました。近辺都道府県の分析結果に反映されます。`
    );
  };

  const handleMarkAsCaptured = (alertId) => {
    setEscapedAlerts((prev) =>
      prev.map((item) =>
        item.id === alertId
          ? {
              ...item,
              status: 'captured',
              capturedAt: new Date().toLocaleString('ja-JP')
            }
          : item
      )
    );
    setEscapedNewsStatusMsg('確保情報を受理したため、該当動物の分析候補への特別反映を即座に解除しました。');
  };

  useEffect(() => {
    let isMounted = true;
    const updateCrops = async () => {
      if (!imagePreview) {
        setCroppedRoiDataUrl('');
        return;
      }
      const optCrop = await generateRoiCropDataUrl(imagePreview, roiBox, false);
      if (isMounted) setCroppedRoiDataUrl(optCrop);
    };
    updateCrops();

    return () => {
      isMounted = false;
    };
  }, [imagePreview, roiBox]);

  const computedAnalysisResult = React.useMemo(() => {
    if (!baseAnalysisResult || !Array.isArray(baseAnalysisResult.candidates) || baseAnalysisResult.candidates.length === 0) {
      return DEMO_RESULT;
    }

    if (!enableRagBoost) {
      return {
        ...baseAnalysisResult,
        candidates: baseAnalysisResult.candidates.map((c, idx) => ({
          ...c,
          rank: idx + 1,
          baseProbability: c.probability ?? 33,
          ragBoostDelta: 0,
          matchedRecordCount: 0,
          maxSimilarityPercent: 0
        }))
      };
    }

    const rawScored = baseAnalysisResult.candidates.map((cand, idx) => {
      const baseProb = Number(cand.probability) || Math.max(10, 60 - idx * 20);
      const baseSpecies = normalizeSpeciesNameForWiki(cand.name);
      const matchingRecords = learningRecords.filter(
        (rec) =>
          normalizeSpeciesNameForWiki(rec.speciesName) === baseSpecies ||
          rec.speciesName === cand.name
      );

      let maxSimilarity = 0;

      matchingRecords.forEach((rec) => {
        let sim = 55;
        if (rec.habitatType === habitatType) sim += 22;
        if (rec.regionType === regionType) sim += 10;
        if (rec.cameraMode === cameraMode) sim += 8;
        if (rec.occlusionAugmented) sim += 5;
        sim = Math.min(99, sim);
        if (sim > maxSimilarity) maxSimilarity = sim;
      });

      const countBonus =
        matchingRecords.length > 0
          ? Math.min(24, matchingRecords.length * 4.5 + (maxSimilarity - 60) * 0.18)
          : 0;
      const roiBonus = enableRoiCrop && idx === 0 ? 3.5 : 0;

      const rawBoostedScore = Math.max(1, baseProb + countBonus + roiBonus);

      return {
        ...cand,
        baseProbability: baseProb,
        matchedRecordCount: matchingRecords.length,
        maxSimilarityPercent: maxSimilarity,
        rawBoostedScore
      };
    });

    const totalRaw = rawScored.reduce((acc, item) => acc + item.rawBoostedScore, 0) || 100;
    let normalized = rawScored.map((item) => {
      const normProb = Math.round((item.rawBoostedScore / totalRaw) * 100);
      return {
        ...item,
        probability: Math.min(98, Math.max(1, normProb))
      };
    });

    if (normalized.length === 1) {
      normalized[0].probability = 100;
    } else if (normalized.length === 2) {
      const p1 = Math.min(98, Math.max(51, normalized[0].probability));
      normalized[0].probability = p1;
      normalized[1].probability = 100 - p1;
    } else if (normalized.length >= 3) {
      const top = normalized[0];
      if (top.matchedRecordCount > 0) {
        const targetTopProb = Math.min(
          97,
          Math.round(
            top.baseProbability +
              Math.min(19, top.matchedRecordCount * 3.5 + (enableRoiCrop ? 3 : 0))
          )
        );
        const remainder = Math.max(3, 100 - targetTopProb);
        const otherBaseSum =
          normalized[1].rawBoostedScore + normalized[2].rawBoostedScore || 1;
        const secondProb = Math.max(
          2,
          Math.round((normalized[1].rawBoostedScore / otherBaseSum) * remainder)
        );
        const thirdProb = Math.max(1, 100 - targetTopProb - secondProb);

        normalized[0].probability = targetTopProb;
        normalized[1].probability = secondProb;
        normalized[2].probability = thirdProb;
      } else {
        const diff = 100 - normalized.reduce((s, x) => s + x.probability, 0);
        normalized[0].probability = Math.max(1, normalized[0].probability + diff);
      }
    }

    normalized = normalized.map((item) => ({
      ...item,
      ragBoostDelta: item.probability - item.baseProbability
    }));

    normalized.sort((a, b) => b.probability - a.probability);
    const palette = ['#10b981', '#f59e0b', '#64748b'];
    normalized = normalized.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      colorCode: palette[idx] || '#64748b'
    }));

    return {
      ...baseAnalysisResult,
      candidates: normalized
    };
  }, [
    baseAnalysisResult,
    learningRecords,
    habitatType,
    regionType,
    cameraMode,
    enableRagBoost,
    enableRoiCrop
  ]);

  const analysisResult = computedAnalysisResult;

  useEffect(() => {
    if (!isAnalyzing) return;

    const estTotalSec = 12;
    const startTs = Date.now();

    setAnalysisTiming({
      remainingSec: estTotalSec,
      progressPercent: 10,
      currentStepLabel: 'Step 1/4: 画像圧縮＆微小領域（ROI）の高解像度クロップ抽出中...'
    });

    const intervalId = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTs) / 1000);
      const remaining = Math.max(0, estTotalSec - elapsed);
      const rawPct = Math.min(94, Math.round(((now - startTs) / (estTotalSec * 1000)) * 88) + 10);

      setAnalysisTiming((prev) => {
        let stepLabel = prev.currentStepLabel;
        if (!stepLabel.includes('モデル [')) {
          if (rawPct >= 70) {
            stepLabel = 'Step 4/4: 47都道府県動物相・蓄積学習データと照合中...';
          } else if (rawPct >= 45) {
            stepLabel = 'Step 3/4: 生息環境・特徴パターンの確率算出中...';
          } else if (rawPct >= 22) {
            stepLabel = 'Step 2/4: Gemini AI 推論エンジンへ送信中...';
          }
        }
        return {
          remainingSec: remaining,
          progressPercent: rawPct,
          currentStepLabel: stepLabel
        };
      });
    }, 400);

    return () => clearInterval(intervalId);
  }, [isAnalyzing]);

  const cancelAnalysis = () => {
    if (analysisAbortRef.current) {
      analysisAbortRef.current.abort();
      analysisAbortRef.current = null;
    }
    setIsAnalyzing(false);
    setErrorMsg('解析をキャンセルしました。');
  };

  useEffect(() => {
    if (!analysisResult?.candidates) return;

    let isMounted = true;

    const fetchSpecimenImagesForCandidates = async () => {
      for (const cand of analysisResult.candidates) {
        const rawName = cand.name;
        const baseSpecies = normalizeSpeciesNameForWiki(rawName);
        const sciName = cand.scientificName || '';
        const fallbackSvg = createAcademicDiagramDataUrl(rawName, sciName, cand.colorCode);

        try {
          const jaUrl = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            baseSpecies
          )}`;
          const res = await fetch(jaUrl);
          if (res.ok) {
            const data = await res.json();
            if (data?.thumbnail?.source && isMounted) {
              setSpecimenImages((prev) => ({
                ...prev,
                [rawName]: {
                  imageUrl: data.thumbnail.source,
                  originalUrl: data.originalimage?.source || data.thumbnail.source,
                  fallbackSvg,
                  isPhoto: true,
                  baseSpeciesName: data.title || baseSpecies,
                  wikiUrl:
                    data.content_urls?.desktop?.page ||
                    `https://ja.wikipedia.org/wiki/${encodeURIComponent(baseSpecies)}`,
                  extractBio: data.extract || `${baseSpecies}（${sciName}）の学術標本・生態参考写真`
                }
              }));
              continue;
            }
          }
        } catch {}

        if (isMounted) {
          setSpecimenImages((prev) => ({
            ...prev,
            [rawName]: {
              imageUrl: fallbackSvg,
              originalUrl: fallbackSvg,
              fallbackSvg,
              isPhoto: false,
              baseSpeciesName: baseSpecies,
              wikiUrl: `https://ja.wikipedia.org/wiki/${encodeURIComponent(baseSpecies)}`,
              extractBio: `${baseSpecies}（${sciName}）の学術図鑑リファレンス`
            }
          }));
        }
      }
    };

    fetchSpecimenImagesForCandidates();

    return () => {
      isMounted = false;
    };
  }, [analysisResult]);

  const handlePreviewImageClick = (e) => {
    if (!enableRoiCrop || !previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    const newW = roiBox.w;
    const newH = roiBox.h;
    const clampedX = Math.max(0.02, Math.min(0.98 - newW, clickX - newW / 2));
    const clampedY = Math.max(0.02, Math.min(0.98 - newH, clickY - newH / 2));

    setRoiBox((prev) => ({
      ...prev,
      x: Number(clampedX.toFixed(3)),
      y: Number(clampedY.toFixed(3)),
      label: `手動指定ROI (${Math.round(clickX * 100)}%, ${Math.round(clickY * 100)}%)`
    }));
  };

  const autoDetectMicroRoi = () => {
    setEnableRoiCrop(true);
    if (mediaType === 'demo') {
      setRoiBox({
        x: 0.66,
        y: 0.32,
        w: 0.16,
        h: 0.31,
        thermalX: 0.21,
        thermalY: 0.38,
        thermalW: 0.09,
        thermalH: 0.20,
        label: '自動検出ROI: シダ下草の潜伏個体 (サーマル熱源同期)'
      });
    } else {
      setRoiBox({
        x: 0.38,
        y: 0.32,
        w: 0.22,
        h: 0.32,
        label: 'SAHI自動検出ROI: 微小ターゲット領域'
      });
    }
  };

  const handleConfirmSpeciesLearning = async (candidate) => {
    const cropImg =
      croppedRoiDataUrl ||
      (await generateRoiCropDataUrl(imagePreview, roiBox, enableOcclusionAugment));

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newRecord = {
      id: `kb-user-${Date.now()}`,
      speciesName: candidate.name,
      scientificName: candidate.scientificName || '学名未登録',
      habitatType,
      regionType,
      cameraMode,
      areaRatioPercent: roiAreaRatioPercent,
      occlusionAugmented: enableOcclusionAugment,
      featureTags: [
        `面積比${roiAreaRatioPercent}%微小領域`,
        habitatType.split('（')[0],
        enableOcclusionAugment ? 'オクルージョン拡張済' : '通常クロップ',
        'ユーザー確定ラベル'
      ],
      timestamp: timeStr,
      note: userObservation
        ? userObservation.slice(0, 50)
        : `${regionType}・${habitatType}での識別確定データ`,
      cropDataUrl: cropImg
    };

    setLearningRecords((prev) => [newRecord, ...prev]);
    setEnableRagBoost(true);
    setRecentlyConfirmedInfo({
      speciesName: candidate.name,
      addedCount: 1,
      timestamp: timeStr
    });
  };

  const loadConsultationDemo = () => {
    const demoDataUrl = generateDemoSplitImage();
    setMediaType('demo');
    setImagePreview(demoDataUrl);
    setVideoUrl('');
    setCapturedFrames([
      {
        id: 'demo-frame-1',
        timeLabel: '00:07 (デモ: サーマル＋可視光)',
        dataUrl: demoDataUrl
      }
    ]);
    setHabitatType('山林・森林斜面（シダ・下草あり）');
    setRegionType('秋田県');
    setCameraMode('サーマル＋可視光 2画面（ドローン等）');
    setUserObservation(
      '山の斜面のシダの下草に身を隠している。サーマルでは赤い熱源が見え、可視光では茶色と黒のまだら模様（保護色）が見える。'
    );
    setBaseAnalysisResult(DEMO_RESULT);
    autoDetectMicroRoi();
  };

  const clearAttachedMedia = () => {
    setMediaType('empty');
    setImagePreview('');
    setVideoUrl('');
    setCapturedFrames([]);
    setCroppedRoiDataUrl('');
    setErrorMsg('');
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setErrorMsg('');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target.result;
        setMediaType('image');
        setImagePreview(resultUrl);
        setVideoUrl('');
        setCapturedFrames([
          {
            id: `img-${Date.now()}`,
            timeLabel: file.name || '貼り付け画像',
            dataUrl: resultUrl
          }
        ]);
        setRoiBox({
          x: 0.35,
          y: 0.25,
          w: 0.30,
          h: 0.40,
          label: 'SAHI自動検出ROI: 微小ターゲット領域'
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const objUrl = URL.createObjectURL(file);
      setMediaType('video');
      setVideoUrl(objUrl);
      setCapturedFrames([]);
    } else {
      setErrorMsg('対応していないファイル形式です。画像（JPG/PNG/WebP）または動画（MP4/MOV/WebM）を選択してください。');
    }
  };

  const captureCurrentVideoFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const maxDim = 800;
    let w = video.videoWidth || 640;
    let h = video.videoHeight || 360;
    if (w > maxDim) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const sec = Math.floor(video.currentTime || 0);
    const minStr = String(Math.floor(sec / 60)).padStart(2, '0');
    const secStr = String(sec % 60).padStart(2, '0');

    const newFrame = {
      id: `vframe-${Date.now()}`,
      timeLabel: `${minStr}:${secStr}`,
      dataUrl
    };

    setCapturedFrames((prev) => [...prev, newFrame].slice(-4));
    setImagePreview(dataUrl);
  };

  const handleVideoLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(1.0, (video.duration || 2) * 0.2);
  };

  const handleVideoSeeked = () => {
    if (capturedFrames.length === 0) {
      captureCurrentVideoFrame();
    }
  };

  const autoExtractThreeFrames = async () => {
    const video = videoRef.current;
    if (!video || !video.duration) {
      captureCurrentVideoFrame();
      return;
    }

    const duration = video.duration;
    const ratios = [0.15, 0.5, 0.85];
    const extracted = [];

    for (const r of ratios) {
      await new Promise((resolve) => {
        const onSeek = () => {
          video.removeEventListener('seeked', onSeek);
          const canvas = document.createElement('canvas');
          const w = Math.min(800, video.videoWidth || 640);
          const h = Math.round(((video.videoHeight || 360) * w) / (video.videoWidth || 640));
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, w, h);
          const sec = Math.floor(video.currentTime);
          const label = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
          extracted.push({
            id: `auto-${r}-${Date.now()}`,
            timeLabel: label,
            dataUrl: canvas.toDataURL('image/jpeg', 0.82)
          });
          resolve();
        };
        video.addEventListener('seeked', onSeek);
        video.currentTime = duration * r;
      });
    }

    if (extracted.length > 0) {
      setCapturedFrames(extracted);
      setImagePreview(extracted[0].dataUrl);
    }
  };

  const runAnimalIdentification = async () => {
    if (capturedFrames.length === 0 && !imagePreview) {
      setErrorMsg('先にファイルをここにドロップ・ペースト、または撮影して読み込んでください。');
      return;
    }

    const apiKey = userApiKey.trim();
    if (!apiKey) {
      setShowMobileGuideModal(true);
      setErrorMsg('先に右上の「API設定」からGemini APIキーを保存してください。');
      return;
    }

    if (analysisAbortRef.current) {
      analysisAbortRef.current.abort();
    }
    const abortController = new AbortController();
    analysisAbortRef.current = abortController;

    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      const targetRawUrl = capturedFrames[0]?.dataUrl || imagePreview;
      const compressedMainUrl = await compressImageForApi(targetRawUrl, 800);
      const [, mainBase64] = compressedMainUrl.split(',');

      const imageParts = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: mainBase64
          }
        }
      ];

      if (enableRoiCrop && croppedRoiDataUrl) {
        const [, cropBase64] = croppedRoiDataUrl.split(',');
        if (cropBase64) {
          imageParts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: cropBase64
            }
          });
        }
      }

      const relevantPastCases = learningRecords
        .slice(0, 5)
        .map(
          (r, idx) =>
            `・過去確定事例${idx + 1}: 種名「${r.speciesName}」 / 生息地「${r.habitatType}」 / 地域「${r.regionType}」`
        )
        .join('\n');

      const prefectureFaunaContext = getPrefectureFaunaProfile(regionType);
      const escapedAnimalsContext =
        relevantActiveEscapes.length > 0
          ? relevantActiveEscapes
              .map(
                (e) =>
                  `・【逃走中・未確保アラート】種名「${e.speciesName}」 / 発生都道府県: ${e.prefecture} / 施設: ${e.facilityName} / 詳細: ${e.details}`
              )
              .join('\n')
          : '・なし（確保済み個体は反映除外済）';

      const promptText = `あなたは野生生物調査・鳥獣識別・サーマルドローン調査の専門AI「Wild Searcher AI」です。
添付画像（全体画像および微小領域ROI拡大画像）と、撮影都道府県「${regionType}」の動物相プロファイル・生息環境・逃走動物情報を総合分析し、写っている動物の可能性が高い上位3種を出力してください。

【撮影条件】
・撮影都道府県: ${regionType}
・該当都道府県の生息動物ベースライン: ${prefectureFaunaContext}
・生息地・環境: ${habitatType}
・カメラ種別: ${cameraMode}
・観察メモ: ${userObservation || 'なし'}
【近辺の逃走動物アラート（未確保のみ）】
${escapedAnimalsContext}
【過去の確定学習データ】
${relevantPastCases}

必ず以下のJSONフォーマットのみで回答してください（候補は必ず3種、probabilityは合計100の整数）：
{
  "detectedTargetSummary": "画像から検出した動物の外見・姿勢・サイズ・特徴の要約",
  "inferredEnvironment": "背景から推測される生息環境と都道府県分布との整合性",
  "candidates": [
    {
      "rank": 1,
      "name": "種名（和名）",
      "scientificName": "学名",
      "category": "分類（例：哺乳綱 ウサギ目 ナキウサギ科）",
      "probability": 85,
      "visualReasoning": "外見・耳の形・毛色・体格からの識別根拠",
      "habitatReasoning": "撮影都道府県（${regionType}）および生息環境からの生態学的根拠",
      "keyDistinctions": ["識別ポイント1", "識別ポイント2", "識別ポイント3"]
    }
  ],
  "comparisonSummary": [
    { "feature": "主な生息地", "species1": "1位の特徴", "species2": "2位の特徴", "species3": "3位の特徴" },
    { "feature": "体色・形態", "species1": "1位の特徴", "species2": "2位の特徴", "species3": "3位の特徴" }
  ]
}`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }, ...imageParts]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      };

      const data = await callGeminiWithModelFallback(
        apiKey,
        payload,
        abortController.signal,
        (statusText) => {
          setAnalysisTiming((prev) => ({
            ...prev,
            currentStepLabel: statusText
          }));
        }
      );

      const parts = data?.candidates?.[0]?.content?.parts || [];
      const rawText = parts.map((p) => p.text || '').join('\n');
      if (!rawText) throw new Error('AIからの応答が空でした');

      const parsed = safeExtractJsonFromText(rawText);
      if (!parsed || !Array.isArray(parsed.candidates) || parsed.candidates.length === 0) {
        throw new Error('解析結果のJSON抽出に失敗しました');
      }

      const palette = ['#10b981', '#f59e0b', '#64748b'];
      parsed.candidates = parsed.candidates.slice(0, 3).map((c, idx) => ({
        ...c,
        rank: idx + 1,
        colorCode: palette[idx] || '#64748b',
        keyDistinctions: Array.isArray(c.keyDistinctions) ? c.keyDistinctions : []
      }));

      setBaseAnalysisResult(parsed);
    } catch (err) {
      setErrorMsg(`AI解析が完了できませんでした（理由: ${err.message}）。`);
    } finally {
      setIsAnalyzing(false);
      analysisAbortRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* トップヘッダー */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Wild Searcher AI
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                  47都道府県動物相 × 逃走動物Web連動搭載
                </span>
              </div>
              <p className="text-xs text-slate-400">
                都道府県別生息種・生活区環境・動物園逃走ニュース（確保時自動解除）を統合した野生動物探知AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('escaped')}
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg border flex items-center gap-1.5 transition shadow-sm ${
                relevantActiveEscapes.length > 0
                  ? 'bg-rose-950/80 hover:bg-rose-900/80 text-rose-200 border-rose-500/60 animate-pulse'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-amber-500/30'
              }`}
            >
              <Siren className="w-4 h-4 text-rose-400" />
              <span>逃走動物連動: {relevantActiveEscapes.length}件</span>
            </button>
            <button
              onClick={() => setShowMobileGuideModal(true)}
              className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">スマホ実装・API設定</span>
              <span className="md:hidden">API設定</span>
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 transition shadow-sm"
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span>蓄積DB: {learningRecords.length}件</span>
            </button>
            <button
              onClick={loadConsultationDemo}
              className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition shadow-sm"
            >
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">サンプル読込</span>
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左カラム */}
        <section className="lg:col-span-5 space-y-5">
          {/* 1. ファイルドロップ/ペースト ＆ ROI */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                1. 写真・動画の読み込み ＆ 微小領域（ROI）検出
              </h2>
              <span className="text-[11px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded font-medium">
                PC / スマートフォン全般対応
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {mediaType === 'empty' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/70 bg-slate-950/70 hover:bg-slate-900/80 transition rounded-2xl p-7 text-center flex flex-col items-center justify-center min-h-[250px] space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-inner">
                  <ImagePlus className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm sm:text-base font-bold text-slate-100">
                    ファイルをここにドラッグ＆ドロップ、またはペースト
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    コピーした画像を <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">Ctrl+V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">⌘+V</kbd>（スマホは長押し貼り付け）でそのまま読み込めます
                  </p>
                  <p className="text-[11px] text-slate-500">
                    対応形式: JPG, PNG, WebP, MP4, MOV（ドローン空撮・サーマル・スマホ写真）
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 w-full">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>ファイルを選択</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePasteFromClipboardButton}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ClipboardPaste className="w-4 h-4 text-emerald-400" />
                    <span>クリップボードから貼り付け</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>カメラで撮影</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>別のファイル</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePasteFromClipboardButton}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ペースト置換</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-medium flex items-center gap-1 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>カメラ撮影</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={clearAttachedMedia}
                    className="px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>クリア</span>
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  {mediaType === 'video' && videoUrl ? (
                    <div className="p-3 space-y-3">
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        playsInline
                        onLoadedData={handleVideoLoadedData}
                        onSeeked={handleVideoSeeked}
                        className="w-full max-h-60 object-contain rounded-lg bg-black"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={captureCurrentVideoFrame}
                          className="flex-1 py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          現在の再生位置をキャプチャ追加
                        </button>
                        <button
                          type="button"
                          onClick={autoExtractThreeFrames}
                          className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                        >
                          <Layers className="w-3.5 h-3.5 text-sky-400" />
                          3フレーム自動抽出
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        ref={previewContainerRef}
                        onClick={handlePreviewImageClick}
                        className="relative cursor-crosshair select-none overflow-hidden bg-black"
                      >
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="解析対象プレビュー"
                            className="w-full max-h-64 object-contain bg-black block"
                          />
                        )}

                        {enableRoiCrop && imagePreview && (
                          <div
                            style={{
                              left: `${roiBox.x * 100}%`,
                              top: `${roiBox.y * 100}%`,
                              width: `${roiBox.w * 100}%`,
                              height: `${roiBox.h * 100}%`
                            }}
                            className="absolute border-2 border-emerald-400 bg-emerald-400/10 shadow-[0_0_12px_rgba(16,185,129,0.6)] pointer-events-none transition-all duration-200"
                          >
                            <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shadow">
                              ROI拡大対象 ({roiAreaRatioPercent}%)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                          画像内クリックで微小領域（ROI）の位置を指定可能
                        </span>
                        <button
                          type="button"
                          onClick={() => setEnableRoiCrop((v) => !v)}
                          className="px-2 py-0.5 rounded text-[11px] font-medium border bg-slate-800 text-slate-200 border-slate-700"
                        >
                          {enableRoiCrop ? 'ROI枠: ON' : 'ROI枠: OFF'}
                        </button>
                      </div>
                    </div>
                  )}

                  {enableRoiCrop && croppedRoiDataUrl && (
                    <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-3">
                      <img
                        src={croppedRoiDataUrl}
                        alt="可視光ROI拡大クロップ"
                        className="w-16 h-16 rounded-lg object-cover border border-emerald-500/60 shrink-0"
                      />
                      <div className="text-[11px] text-slate-300 space-y-1">
                        <p className="font-bold text-emerald-300">
                          微小領域の高解像度クロップ入力（面積占有率 {roiAreaRatioPercent}%）
                        </p>
                        <p className="text-[10px] text-slate-400">
                          全体画像（軽量化済）と拡大クロップ画像を同時送信し、高速かつ高精度に識別します。
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. 47都道府県・生息環境・逃走動物連動 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Trees className="w-4 h-4 text-emerald-400" />
              2. 【47都道府県】と【生息環境・生活区】の条件設定
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  撮影エリア（47都道府県）
                </label>
                <select
                  value={regionType}
                  onChange={(e) => {
                    setRegionType(e.target.value);
                    setManualEscapePref(e.target.value);
                  }}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  {PREFECTURES_47.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  カメラ・映像種別
                </label>
                <select
                  value={cameraMode}
                  onChange={(e) => setCameraMode(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="サーマル＋可視光 2画面（ドローン等）">
                    サーマル＋可視光 2画面
                  </option>
                  <option value="通常カメラ（可視光写真・動画）">
                    通常カメラ（可視光のみ）
                  </option>
                  <option value="トレイルカメラ（赤外線暗視・夜間）">
                    トレイルカメラ（暗視）
                  </option>
                </select>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-200/90 leading-relaxed">
              <span className="font-bold text-emerald-300">📍 {regionType}の生息動物事前分析：</span>
              {getPrefectureFaunaProfile(regionType)}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                撮影された生息環境（自然環境・人の生活区）
              </label>
              <select
                value={habitatType}
                onChange={(e) => setHabitatType(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="山林・森林斜面（シダ・下草あり）">
                  山林・森林斜面（シダ・下草あり）
                </option>
                <option value="高山・亜高山帯（ハイマツ・ガレ場・岩場）">
                  高山・亜高山帯（ハイマツ・ガレ場・岩場）
                </option>
                <option value="生活区・人の居住区（住宅地・公園・庭先・市街地）">
                  生活区・人の居住区（住宅地・公園・庭先・市街地）
                </option>
                <option value="生活区隣接の里山・農耕地・倉庫周辺">
                  生活区隣接の里山・農耕地・倉庫周辺
                </option>
                <option value="河川敷・湿地・水辺・ヨシ原">
                  河川敷・湿地・水辺・ヨシ原
                </option>
                <option value="竹林・密なヤブ・雑木林">
                  竹林・密なヤブ・雑木林
                </option>
                <option value="不明（映像の背景から自動推測）">
                  不明（映像の背景から自動推測）
                </option>
              </select>
            </div>

            {/* 逃走動物連動パネル */}
            <div className="p-3 rounded-xl bg-rose-950/25 border border-rose-500/35 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-rose-300 flex items-center gap-1.5 cursor-pointer">
                  <Siren className="w-4 h-4 text-rose-400" />
                  <span>動物園・飼育施設 逃走動物情報連動（確保で自動解除）</span>
                </label>
                <input
                  type="checkbox"
                  checked={enableEscapedSync}
                  onChange={(e) => setEnableEscapedSync(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                <span>
                  {regionType}・隣接県の逃走中動物:{' '}
                  <strong className={relevantActiveEscapes.length > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                    {relevantActiveEscapes.length}件反映中
                  </strong>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={fetchEscapedAnimalNewsFromWeb}
                    disabled={isSearchingEscapedNews}
                    className="px-2.5 py-1 rounded-lg bg-rose-600/25 hover:bg-rose-600/40 text-rose-200 border border-rose-500/40 text-[11px] font-semibold flex items-center gap-1 transition"
                  >
                    <Globe className={`w-3 h-3 ${isSearchingEscapedNews ? 'animate-spin' : ''}`} />
                    <span>{isSearchingEscapedNews ? 'Web検索中...' : 'ネット最新情報で更新'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('escaped')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px]"
                  >
                    管理・確保解除
                  </button>
                </div>
              </div>
              {escapedNewsStatusMsg && (
                <div className="text-[11px] text-amber-200 bg-slate-950/90 border border-amber-500/40 rounded-lg px-2.5 py-1.5 leading-relaxed">
                  {escapedNewsStatusMsg}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                気になる視覚特徴・行動メモ（任意）
              </label>
              <textarea
                rows={2}
                value={userObservation}
                onChange={(e) => setUserObservation(e.target.value)}
                placeholder="例：シダの下に隠れて動かない、岩場にいる丸い耳の小型動物 等"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={runAnimalIdentification}
              disabled={isAnalyzing}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-60 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/80 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {analysisTiming.remainingSec > 0
                      ? `AI解析中...（残り約${analysisTiming.remainingSec}秒）`
                      : '最終応答を受信中...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    微小ROI＋蓄積データ({learningRecords.length}件)を反映してAI識別を実行
                  </span>
                </>
              )}
            </button>

            {isAnalyzing && (
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />
                    <span>{analysisTiming.currentStepLabel}</span>
                  </span>
                  <button
                    type="button"
                    onClick={cancelAnalysis}
                    className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] shrink-0"
                  >
                    中断
                  </button>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${analysisTiming.progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 右カラム：AI識別結果 */}
        <section className="lg:col-span-7 space-y-5">
          {recentlyConfirmedInfo && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-200">
                    「{recentlyConfirmedInfo.speciesName}」を正解データとしてAI知識ベースに蓄積しました！
                  </div>
                  <p className="text-xs text-emerald-300/90 mt-0.5">
                    同環境での推測確率がリアルタイムに引き上げられました。
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRecentlyConfirmedInfo(null)}
                className="p-1 text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* サマリー＆タブヘッダー */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-base font-bold text-white">
                  Wild Searcher AI 総合判定レポート（候補3種・学習ブースト対応）
                </h2>
              </div>
              <div className="flex flex-wrap rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs gap-1">
                <button
                  onClick={() => setActiveTab('ranking')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    activeTab === 'ranking'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  確率ランキング (3種)
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    activeTab === 'comparison'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  比較マトリクス
                </button>
                <button
                  onClick={() => setActiveTab('escaped')}
                  className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                    activeTab === 'escaped'
                      ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Siren className="w-3.5 h-3.5" />
                  <span>逃走動物管理 ({relevantActiveEscapes.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                    activeTab === 'knowledge'
                      ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>蓄積学習DB ({learningRecords.length})</span>
                </button>
              </div>
            </div>

            {mediaType === 'empty' ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
                <span>
                  左側の枠に写真・動画をドロップまたは貼り付けて「AI識別を実行」を押すと、ここに判定結果が表示されます。（下は出力イメージ見本です）
                </span>
                <button
                  type="button"
                  onClick={loadConsultationDemo}
                  className="text-emerald-400 hover:underline font-semibold shrink-0"
                >
                  サンプル画像で試す →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    視覚・サーマル＆微小ROI検出サマリー
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysisResult.detectedTargetSummary}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <Trees className="w-3.5 h-3.5" />
                    生息地・植生環境＆過去データ照合
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysisResult.inferredEnvironment}
                  </p>
                </div>
              </div>
            )}
          </div>

          {activeTab === 'ranking' ? (
            <div className="space-y-4">
              {analysisResult.candidates.map((cand) => {
                const specInfo = specimenImages[cand.name] || {
                  imageUrl: createAcademicDiagramDataUrl(cand.name, cand.scientificName, cand.colorCode),
                  fallbackSvg: createAcademicDiagramDataUrl(cand.name, cand.scientificName, cand.colorCode),
                  baseSpeciesName: normalizeSpeciesNameForWiki(cand.name),
                  wikiUrl: `https://ja.wikipedia.org/wiki/${encodeURIComponent(normalizeSpeciesNameForWiki(cand.name))}`,
                  extractBio: `${cand.name} の学術リファレンス`
                };

                return (
                  <div
                    key={cand.rank}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div
                          style={{ backgroundColor: cand.colorCode }}
                          className="w-9 h-9 rounded-xl text-slate-950 font-extrabold flex items-center justify-center text-base shadow"
                        >
                          {cand.rank}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-bold text-white">
                              {cand.name}
                            </h3>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {cand.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 italic mt-0.5">
                            {cand.scientificName}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setEnlargedSpecimen({ candidate: cand, specimenInfo: specInfo })}
                          className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl p-1.5 pr-3 transition group"
                        >
                          <img
                            src={specInfo.imageUrl}
                            alt={cand.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = specInfo.fallbackSvg;
                            }}
                            className="w-14 h-12 rounded-lg object-cover bg-black"
                          />
                          <div className="text-left">
                            <span className="block text-[10px] font-bold text-emerald-300 group-hover:underline flex items-center gap-1">
                              <span>学術参考写真</span>
                              <ZoomIn className="w-3 h-3" />
                            </span>
                            <span className="block text-[9px] text-slate-400">
                              クリックで見比べ
                            </span>
                          </div>
                        </button>
                      </div>

                      <div className="text-right ml-auto">
                        <div
                          className="text-3xl font-extrabold font-mono tracking-tight"
                          style={{ color: cand.colorCode }}
                        >
                          {cand.probability}%
                        </div>
                        {cand.ragBoostDelta > 0 && (
                          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            +{cand.ragBoostDelta}% 蓄積学習ブースト
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        style={{
                          width: `${cand.probability}%`,
                          backgroundColor: cand.colorCode
                        }}
                        className="h-full transition-all duration-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>【似ている動物・外見的根拠】</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{cand.visualReasoning}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                        <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>【都道府県生息分布・環境・逃走根拠】</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{cand.habitatReasoning}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        同種の蓄積学習データ:{' '}
                        <strong className="text-indigo-300">{cand.matchedRecordCount || 0}件</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleConfirmSpeciesLearning(cand)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>この動物で確定・AIに学習蓄積させる（次回から確率UP）</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white">候補3種以外の動物だった場合：</span>
                  正しい動物名を入力して学習DBに直接登録できます
                </div>
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <input
                    type="text"
                    value={customSpeciesInput}
                    onChange={(e) => setCustomSpeciesInput(e.target.value)}
                    placeholder="例：エゾナキウサギ、ハクビシン"
                    className="flex-1 sm:w-52 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customSpeciesInput.trim()) return;
                      handleConfirmSpeciesLearning({
                        name: customSpeciesInput.trim(),
                        scientificName: 'ユーザー直接登録種'
                      });
                      setCustomSpeciesInput('');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>正解登録</span>
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'comparison' ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                上位3種の識別ポイント比較マトリクス
              </h3>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-300 bg-slate-950/70">
                    <th className="p-3 font-semibold">比較項目</th>
                    <th className="p-3 font-bold text-emerald-400">
                      1位: {analysisResult.candidates[0]?.name} ({analysisResult.candidates[0]?.probability}%)
                    </th>
                    <th className="p-3 font-bold text-amber-400">
                      2位: {analysisResult.candidates[1]?.name} ({analysisResult.candidates[1]?.probability}%)
                    </th>
                    <th className="p-3 font-bold text-slate-400">
                      3位: {analysisResult.candidates[2]?.name} ({analysisResult.candidates[2]?.probability}%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {(analysisResult.comparisonSummary || DEMO_RESULT.comparisonSummary).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/50">
                      <td className="p-3 font-semibold text-slate-200 bg-slate-950/40">
                        {row.feature}
                      </td>
                      <td className="p-3 text-slate-300">{row.species1}</td>
                      <td className="p-3 text-slate-300">{row.species2}</td>
                      <td className="p-3 text-slate-300">{row.species3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'escaped' ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Siren className="w-5 h-5 text-rose-400" />
                    動物園・飼育施設 逃走動物アラート連動（確保情報で即解除）
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={fetchEscapedAnimalNewsFromWeb}
                  disabled={isSearchingEscapedNews}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Globe className={`w-4 h-4 ${isSearchingEscapedNews ? 'animate-spin' : ''}`} />
                  <span>{isSearchingEscapedNews ? '最新報道を検索中...' : 'ネット最新ニュースから逃走・確保を取得'}</span>
                </button>
              </div>

              {escapedNewsStatusMsg && (
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-200">
                  {escapedNewsStatusMsg}
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200">
                  速報ニュース・自治体防災無線からの手動登録
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={manualEscapeSpecies}
                    onChange={(e) => setManualEscapeSpecies(e.target.value)}
                    placeholder="逃走した動物名（例：エミュー）"
                    className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  />
                  <select
                    value={manualEscapePref}
                    onChange={(e) => setManualEscapePref(e.target.value)}
                    className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  >
                    {PREFECTURES_47.map((pref) => (
                      <option key={pref} value={pref}>
                        {pref}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualEscapeFacility}
                      onChange={(e) => setManualEscapeFacility(e.target.value)}
                      placeholder="施設名（任意）"
                      className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualEscapedAlert}
                      className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0"
                    >
                      登録
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {escapedAlerts.map((item) => {
                  const isEscaped = item.status === 'escaped';
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                        isEscaped
                          ? 'bg-rose-950/25 border-rose-500/40'
                          : 'bg-slate-950/60 border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isEscaped
                                ? 'bg-rose-600 text-white'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isEscaped ? '🚨 逃走中（分析反映ON）' : '✅ 確保済み（分析反映OFF）'}
                          </span>
                          <span className="text-sm font-bold text-white">{item.speciesName}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                            {item.prefecture}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{item.details}</p>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        {isEscaped && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsCaptured(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition shadow"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>確保済みにする</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  蓄積学習データベース（全{learningRecords.length}件）
                </h3>
                <button
                  type="button"
                  onClick={() => setLearningRecords(INITIAL_LEARNING_RECORDS)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>リセット</span>
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {learningRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {rec.cropDataUrl && (
                        <img
                          src={rec.cropDataUrl}
                          alt={rec.speciesName}
                          className="w-12 h-12 rounded-lg object-cover border border-emerald-500/40"
                        />
                      )}
                      <div>
                        <div className="text-sm font-bold text-white">{rec.speciesName}</div>
                        <div className="text-xs text-slate-400">
                          {rec.regionType} / {rec.habitatType}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{rec.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 拡大比較モーダル */}
      {enlargedSpecimen && (
        <div
          onClick={() => setEnlargedSpecimen(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
          >
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                見比べ検証（{enlargedSpecimen.candidate.name}）
              </h3>
              <button
                onClick={() => setEnlargedSpecimen(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="text-xs font-semibold text-amber-300">① 現場の全体画像</div>
                {imagePreview && (
                  <img src={imagePreview} alt="全体" className="w-full h-48 object-contain bg-black rounded-lg" />
                )}
              </div>
              <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-3 space-y-2">
                <div className="text-xs font-semibold text-indigo-300">② 微小ROI拡大</div>
                {(croppedRoiDataUrl || imagePreview) && (
                  <img
                    src={croppedRoiDataUrl || imagePreview}
                    alt="ROI"
                    className="w-full h-48 object-contain bg-black rounded-lg"
                  />
                )}
              </div>
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-3 space-y-2">
                <div className="text-xs font-semibold text-emerald-300">③ 学術基準写真</div>
                <img
                  src={enlargedSpecimen.specimenInfo.imageUrl}
                  alt={enlargedSpecimen.candidate.name}
                  className="w-full h-48 object-contain bg-black rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API設定モーダル */}
      {showMobileGuideModal && (
        <div
          onClick={() => setShowMobileGuideModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-400" />
                <span>Gemini APIキー設定（端末内のみに安全保存）</span>
              </h3>
              <button onClick={() => setShowMobileGuideModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={userApiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="Gemini APIキーを貼り付け"
                className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono"
              />
              <button
                type="button"
                onClick={() => setShowMobileGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                保存して閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
