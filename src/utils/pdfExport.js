import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Initialize fonts correctly for pdfMake
if (pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts && pdfFonts.vfs) {
  pdfMake.vfs = pdfFonts.vfs;
} else if (window && window.pdfMake && window.pdfMake.vfs) {
  pdfMake.vfs = window.pdfMake.vfs;
}

export const exportChartToPDF = (chartDataWrapper, profileName = "Your") => {
  const data = chartDataWrapper.chartData || chartDataWrapper;
  
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: function(currentPage, pageCount) {
      if (currentPage === 1) return null;
      return {
        text: 'Numerology Comprehensive Analysis',
        alignment: 'right',
        margin: [40, 20, 40, 0],
        fontSize: 9,
        color: '#94A3B8'
      };
    },
    footer: function(currentPage, pageCount) {
      return {
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'center',
        margin: [0, 20, 0, 0],
        fontSize: 9,
        color: '#94A3B8'
      };
    },
    content: [
      {
        stack: [
          { text: 'NUMEROLOGY', fontSize: 36, bold: true, color: '#0F172A', tracking: 5, margin: [0, 0, 0, 10] },
          { text: 'COMPREHENSIVE ANALYSIS', fontSize: 18, color: '#3B82F6', tracking: 2, margin: [0, 0, 0, 40] },
          { text: `Prepared exclusively for`, fontSize: 12, color: '#64748B', italics: true, margin: [0, 0, 0, 5] },
          { text: profileName, fontSize: 24, bold: true, color: '#1E293B', margin: [0, 0, 0, 40] },
          { text: 'A detailed algorithmic permutation based on your exact Birth Date and Full Name.', fontSize: 11, color: '#475569', margin: [0, 0, 0, 10] }
        ],
        alignment: 'center',
        margin: [0, 150, 0, 0],
        pageBreak: 'after'
      }
    ],
    styles: {
      sectionTitle: { fontSize: 18, bold: true, color: '#0F172A' },
      cardTitle: { fontSize: 12, bold: true, color: '#0F172A', margin: [0, 0, 0, 4] },
      cardValue: { fontSize: 22, bold: true, color: '#3B82F6', margin: [0, 0, 0, 8] },
      readingText: { fontSize: 10, italics: true, color: '#334155', margin: [0, 0, 0, 6], lineHeight: 1.2 },
      deepText: { fontSize: 9, color: '#475569', margin: [0, 0, 0, 6], lineHeight: 1.3 },
      exampleText: { fontSize: 9, color: '#64748B', italics: true, background: '#F8FAFC' }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  const addSectionHeader = (title) => {
    docDefinition.content.push({
      table: {
        widths: ['*'],
        body: [ [ { text: title, style: 'sectionTitle', border: [false, false, false, true] } ] ]
      },
      layout: {
        hLineWidth: function (i, node) { return (i === node.table.body.length) ? 2 : 0; },
        hLineColor: function () { return '#3B82F6'; },
        vLineWidth: function () { return 0; },
        paddingBottom: function () { return 8; }
      },
      margin: [0, 20, 0, 20]
    });
  };

  const chunkArray = (arr, size) => {
    const res = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  };

  const addSection = (title, items) => {
    addSectionHeader(title);
    
    const validItems = items.filter(Boolean);
    const chunks = chunkArray(validItems, 2);
    
    chunks.forEach(chunk => {
      const columns = chunk.map(item => ({
        width: '48%',
        table: {
          widths: ['*'],
          body: [
            [
              {
                stack: [
                  { text: item.title, style: 'cardTitle' },
                  { text: String(item.value || 'None'), style: 'cardValue' },
                  ...(item.reading ? [{ text: item.reading, style: 'readingText' }] : []),
                  ...(item.deepDetails ? [{ text: item.deepDetails, style: 'deepText' }] : []),
                  ...(item.example ? [{ text: "Example: " + item.example, style: 'exampleText' }] : []),
                ],
                fillColor: '#F1F5F9',
                margin: [10, 10, 10, 10]
              }
            ]
          ]
        },
        layout: 'noBorders'
      }));

      if (columns.length === 1) {
        columns.push({ width: '4%', text: '' }, { width: '48%', text: '' });
      } else {
        columns.splice(1, 0, { width: '4%', text: '' });
      }

      docDefinition.content.push({ columns, margin: [0, 0, 0, 15], unbreakable: true });
    });
  };

  // 1. Core Pillars
  addSection("Core Pillars", [
    { title: "Life Path Number", ...data.core.lifePath },
    { title: "Destiny / Expression", ...data.core.destiny },
    { title: "Soul Urge / Heart", ...data.core.soulUrge },
    { title: "Personality Number", ...data.core.personality },
    { title: "Maturity Number", ...data.core.maturity },
    { title: "Birth Day Number", ...data.core.birthDay }
  ]);

  // 2. Characteristics
  addSection("Characteristics & Traits", [
    { title: "Attitude", ...data.characteristics.attitude },
    { title: "Balance", ...data.characteristics.balance },
    { title: "Hidden Passion", ...data.characteristics.hiddenPassion },
    { title: "Subconscious", ...data.characteristics.subconsciousSelf },
    { title: "Rational Thought", ...data.characteristics.rationalThought }
  ]);

  // 3. Permutations
  addSection("Exhaustive Permutations", [
    { title: "Life Path - Destiny Bridge", ...data.permutations.bridgeLifePathDestiny },
    { title: "Soul - Personality Bridge", ...data.permutations.bridgeSoulPersonality },
    { title: "Cornerstone", ...data.permutations.cornerstone, value: data.permutations.cornerstone.letter },
    { title: "Capstone", ...data.permutations.capstone, value: data.permutations.capstone.letter },
    { title: "First Vowel", ...data.permutations.firstVowel, value: data.permutations.firstVowel.letter }
  ]);

  // 4. Planes
  addSection("Planes of Expression", [
    { title: "Physical Plane", ...data.permutations.planes.physical, value: data.permutations.planes.physical.count },
    { title: "Mental Plane", ...data.permutations.planes.mental, value: data.permutations.planes.mental.count },
    { title: "Emotional Plane", ...data.permutations.planes.emotional, value: data.permutations.planes.emotional.count },
    { title: "Intuitive Plane", ...data.permutations.planes.intuitive, value: data.permutations.planes.intuitive.count }
  ]);

  // 5. Birth Grid
  const birthGridItems = data.permutations.birthGrid?.map(bg => ({
    title: `Digit ${bg.digit} Frequency (${bg.count} occurrences)`,
    value: String(bg.digit).repeat(bg.count),
    reading: bg.reading,
    deepDetails: bg.deepDetails,
    example: bg.example
  })) || [];
  if (birthGridItems.length > 0) {
    addSection("Birth Grid Frequencies", birthGridItems);
  }

  // 6. Cycles
  addSection("Temporal Cycles & Forecasting", [
    { title: "Personal Year", ...data.cycles.personalYear },
    { title: "Personal Month", ...data.cycles.personalMonth },
    { title: "Personal Day", ...data.cycles.personalDay }
  ]);

  const addCycleList = (title, obj) => {
    addSectionHeader(title);
    const validItems = Object.entries(obj).map(([k, v]) => ({
      title: k.toUpperCase(),
      value: v.value,
      reading: v.reading,
      deepDetails: v.deepDetails
    }));
    
    const chunks = chunkArray(validItems, 2);
    chunks.forEach(chunk => {
      const columns = chunk.map(item => ({
        width: '48%',
        table: {
          widths: ['*'],
          body: [
            [
              {
                stack: [
                  { text: item.title, style: 'cardTitle' },
                  { text: String(item.value || 'None'), style: 'cardValue' },
                  ...(item.reading ? [{ text: item.reading, style: 'readingText' }] : []),
                  ...(item.deepDetails ? [{ text: item.deepDetails, style: 'deepText' }] : []),
                ],
                fillColor: '#F1F5F9',
                margin: [10, 10, 10, 10]
              }
            ]
          ]
        },
        layout: 'noBorders'
      }));

      if (columns.length === 1) {
        columns.push({ width: '4%', text: '' }, { width: '48%', text: '' });
      } else {
        columns.splice(1, 0, { width: '4%', text: '' });
      }

      docDefinition.content.push({ columns, margin: [0, 0, 0, 15], unbreakable: true });
    });
  };

  addCycleList("Pinnacle Cycles", data.cycles.pinnacles);
  addCycleList("Challenge Cycles", data.cycles.challenges);

  // 7. Karma
  addSection("Karmic Indicators", [
    { title: "Karmic Debts", value: data.karma.karmicDebts?.map(k=>k.value).join(", ") || "None", reading: "Debts from past lives." },
    { title: "Karmic Lessons", value: data.karma.karmicLessons?.map(k=>k.value).join(", ") || "None", reading: "Missing numbers representing weaknesses." }
  ]);

  pdfMake.createPdf(docDefinition).download('Numerology_Chart.pdf');
};
