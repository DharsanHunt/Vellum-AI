import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers, Sparkles, Eye, ShieldCheck, AlertTriangle, User, Award, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Dossier } from '../../types';
import { Badge, KbdBadge } from '../../components/common/Badge';
import { ForensicLoupe } from './ForensicLoupe';

interface DocumentCanvasProps {
  dossier: Dossier;
  activeLayer: number;
  onLayerChange: (layer: number) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  dossier,
  activeLayer,
  onLayerChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  const numAnomalies = dossier.suspiciousBboxes.length;

  // Render Template 1: Academic Degree Certificate (Gold Crest, Calligraphy, Seals)
  const renderCertificate = () => (
    <div className="h-full flex flex-col justify-between relative z-10">
      {/* Ornate Guilloché Border Frame with Insets */}
      <div className="absolute inset-3 border-2 border-amber-800/15 rounded-xs pointer-events-none" />
      <div className="absolute inset-4.5 border border-amber-900/10 rounded-xs pointer-events-none" />
      <div className="absolute inset-[19px] border border-amber-700/5 rounded-xs pointer-events-none" />

      {/* Certificate Header with Golden Crest */}
      <div className="text-center space-y-2 relative z-10 pt-2">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF5D6] via-[#E8D08D] to-[#C49B3E] border border-amber-400/80 text-amber-950 text-xl shadow-[0_2px_8px_rgba(180,140,50,0.2),inset_0_1px_1px_rgba(255,255,255,0.9)] mb-1">
          🏛️
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight uppercase text-zinc-950">
          {dossier.institution}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-amber-900/20" />
          <p className="text-[10px] tracking-[0.2em] uppercase text-amber-950/70 font-semibold">
            Official Academic Credential &bull; Board of Regents
          </p>
          <span className="h-px w-8 bg-amber-900/20" />
        </div>
      </div>

      {/* Candidate Body */}
      <div className="text-center space-y-4 my-4 relative z-10">
        <p className="font-serif italic text-xs md:text-sm text-zinc-600">This certifies that</p>
        <div className="font-serif text-3xl md:text-4xl font-bold text-zinc-950 border-b border-zinc-300/80 pb-2.5 mx-8 tracking-tight drop-shadow-sm">
          {dossier.candidateName}
        </div>
        <p className="font-serif italic text-xs md:text-sm text-zinc-600">
          has successfully fulfilled all prescribed requirements for the conferral of the degree of
        </p>
        <div className="font-sans font-bold text-base md:text-lg text-zinc-900 tracking-tight">
          {dossier.degree}
        </div>
        <div className="font-mono text-[10px] text-zinc-400 pt-1 flex items-center justify-center gap-3">
          <span>Certificate ID: <strong className="text-zinc-700">{dossier.certificateNumber}</strong></span>
          <span>&bull;</span>
          <span>Reg No: <strong className="text-zinc-700">{dossier.registrationNumber}</strong></span>
        </div>
      </div>

      {/* Certificate Footer */}
      <div className="flex items-end justify-between pt-4 border-t border-zinc-200/80 relative z-10">
        <div className="text-center space-y-1 w-44">
          <div className="relative pb-1">
            <svg className="w-36 h-10 mx-auto text-zinc-900" viewBox="0 0 160 40" fill="none">
              <path
                d="M10 28 C25 15, 30 5, 45 22 C55 35, 60 12, 75 18 C90 24, 95 32, 115 15 C125 7, 135 25, 150 20"
                stroke="#18181B"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M25 22 C50 26, 90 24, 140 22" stroke="#18181B" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <div className="border-b border-zinc-400/80 mt-1" />
          </div>
          <div className="font-serif text-xs font-semibold text-zinc-800">Dr. Arvind Swaminathan</div>
          <div className="text-[9px] text-zinc-400 uppercase tracking-wider font-medium">Registrar &amp; Dean</div>
        </div>

        <div className="relative group cursor-pointer">
          <div className="h-20 w-20 rounded-full border-2 border-dashed border-rose-700/80 bg-gradient-to-br from-rose-50 via-rose-100/70 to-rose-200/50 shadow-[0_6px_16px_rgba(225,29,72,0.18),inset_0_2px_4px_rgba(255,255,255,0.9)] flex flex-col items-center justify-center text-center p-1 text-rose-800 transition-transform duration-200 group-hover:scale-105">
            <div className="h-16 w-16 rounded-full border border-rose-600/40 flex flex-col items-center justify-center p-1 bg-white/30 backdrop-blur-[1px]">
              <span className="text-[8px] font-bold uppercase tracking-tight text-rose-900">OFFICIAL SEAL</span>
              <span className="text-[7px] font-mono font-bold text-rose-800">APEX UNIV</span>
              <span className="text-[6px] text-rose-700 font-mono mt-0.5">★ 2024 ★</span>
            </div>
          </div>
        </div>

        <div className="text-right space-y-0.5 w-44">
          <div className="font-mono text-xs font-semibold text-zinc-900">{dossier.dateOfIssue}</div>
          <div className="text-[9px] text-zinc-400 uppercase tracking-wider font-medium">Date of Inscription</div>
          <div className="text-[9px] font-mono text-zinc-400">Class of 2024</div>
        </div>
      </div>
    </div>
  );

  // Render Template 2: Official Academic Transcript (Tabular Course Matrix, Tampered GPA Row)
  const renderTranscript = () => (
    <div className="h-full flex flex-col justify-between relative z-10">
      {/* Transcript Header */}
      <div className="border-b-2 border-zinc-900 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              NIS
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold uppercase tracking-tight text-zinc-950">
                {dossier.institution}
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Office of the Registrar &bull; Official Academic Transcript of Records
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-zinc-600">
            <div>DOC ID: <strong className="text-zinc-950">{dossier.certificateNumber}</strong></div>
            <div>ISSUED: <strong>{dossier.dateOfIssue}</strong></div>
          </div>
        </div>

        {/* Student Data Bar */}
        <div className="mt-3 grid grid-cols-4 gap-2 bg-zinc-100/80 p-2.5 rounded-lg border border-zinc-200/80 text-[11px]">
          <div>
            <span className="text-[9px] text-zinc-400 uppercase block">Candidate Name</span>
            <span className="font-bold text-zinc-900">{dossier.candidateName}</span>
          </div>
          <div>
            <span className="text-[9px] text-zinc-400 uppercase block">Student ID / Reg</span>
            <span className="font-mono font-semibold text-zinc-900">{dossier.registrationNumber}</span>
          </div>
          <div className="col-span-2">
            <span className="text-[9px] text-zinc-400 uppercase block">Academic Program</span>
            <span className="font-semibold text-zinc-900">{dossier.degree}</span>
          </div>
        </div>
      </div>

      {/* Course Grade Table */}
      <div className="my-3 overflow-hidden rounded-lg border border-zinc-200/90 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-zinc-100/90 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
              <th className="py-2 px-3">Course Code</th>
              <th className="py-2 px-3">Course Title</th>
              <th className="py-2 px-3 text-center">Credits</th>
              <th className="py-2 px-3 text-right">Grade Awarded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
            {(dossier.transcriptCourses || [
              { code: 'CS-501', title: 'Advanced Machine Learning & Neural Networks', credits: 4, grade: 'A+' },
              { code: 'CS-504', title: 'Distributed Systems & Cloud Computing', credits: 4, grade: 'A+' },
              { code: 'DS-510', title: 'Statistical Inference & Bayesian Modeling', credits: 3, grade: 'A' },
              { code: 'DS-520', title: 'Big Data Architecture (Spliced from C+)', credits: 4, grade: 'A+', tampered: true },
              { code: 'MA-502', title: 'Matrix Computations & Optimization', credits: 3, grade: 'A' },
            ]).map((c, i) => (
              <tr
                key={i}
                className={c.tampered ? 'bg-rose-50/70 text-rose-950 font-bold border-l-4 border-rose-500' : 'hover:bg-zinc-50/50'}
              >
                <td className="py-1.5 px-3 font-bold text-zinc-700">{c.code}</td>
                <td className="py-1.5 px-3 font-sans font-medium text-zinc-900 flex items-center gap-1.5">
                  {c.title}
                  {c.tampered && (
                    <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-mono font-bold">
                      FLAGGED
                    </span>
                  )}
                </td>
                <td className="py-1.5 px-3 text-center">{c.credits}.0</td>
                <td className={`py-1.5 px-3 text-right font-bold ${c.tampered ? 'text-rose-600 text-sm' : 'text-zinc-900'}`}>
                  {c.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transcript Summary & Signatures */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-zinc-900 text-white text-center shadow-xs">
            <span className="text-[9px] font-mono text-zinc-400 block uppercase">Cumulative GPA</span>
            <span className="font-serif text-lg font-bold text-amber-300">
              {dossier.gpa || '3.98 / 4.00'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            <div>Total Credits Earned: <strong>18.0</strong></div>
            <div>Academic Standing: <strong>First Class with Distinction</strong></div>
          </div>
        </div>

        {/* Controller Stamp & Signature */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <svg className="w-28 h-7 text-zinc-900" viewBox="0 0 160 40" fill="none">
              <path d="M10 30 C30 10, 50 40, 80 15 C100 5, 120 35, 150 18" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="border-t border-zinc-300 text-[9px] font-semibold text-zinc-800">
              Controller of Examinations
            </div>
          </div>
          <div className="h-14 w-14 rounded-full border-2 border-dashed border-blue-700/80 bg-blue-50/80 flex flex-col items-center justify-center text-[7px] font-bold text-blue-900 shadow-inner">
            <span>REGISTRAR</span>
            <span>VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Template 3: Letter of Recommendation (LOR)
  const renderLOR = () => (
    <div className="h-full flex flex-col justify-between relative z-10 text-left font-serif">
      {/* LOR Institutional Letterhead */}
      <div className="border-b-2 border-zinc-900/80 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-950 to-zinc-900 text-amber-300 flex items-center justify-center text-xl shadow-sm">
            🏛️
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-zinc-950">
              {dossier.institution}
            </h2>
            <p className="font-sans text-[10px] tracking-wider uppercase text-zinc-600 font-semibold">
              Department of Artificial Intelligence &bull; Faculty of Computing
            </p>
          </div>
        </div>
        <div className="text-right font-mono text-[10px] text-zinc-500 font-sans">
          <div>Ref: <strong className="text-zinc-900">{dossier.certificateNumber}</strong></div>
          <div>Date: <strong>{dossier.dateOfIssue}</strong></div>
        </div>
      </div>

      {/* Salutation & Body */}
      <div className="my-4 space-y-3 text-zinc-800 text-xs md:text-sm leading-relaxed">
        <p className="font-bold text-zinc-900">
          {dossier.lorContent?.salutation || 'To the Graduate Admissions Committee,'}
        </p>

        {(dossier.lorContent?.bodyParagraphs || [
          `It is with the highest academic regard that I write this letter of recommendation for ${dossier.candidateName}, who conducted advanced research under my supervision at the Artificial Intelligence Laboratory at ${dossier.institution}.`,
          `During his tenure, ${dossier.candidateName} demonstrated exceptional intellectual curiosity and technical proficiency in generative diffusion architectures. He served as the primary contributor to our research on real-time neural image compression.`,
          `Aditya ranks within the top 1% of graduate scholars I have mentored across my 18-year career. I recommend him without reservation for your doctoral program.`
        ]).map((p, idx) => (
          <p key={idx} className="text-justify font-sans text-xs md:text-[13px] text-zinc-700 leading-normal">
            {p}
          </p>
        ))}
      </div>

      {/* Signatory Recommender Block */}
      <div className="flex items-end justify-between pt-3 border-t border-zinc-200">
        <div className="space-y-1">
          <p className="text-xs text-zinc-600 font-sans">Respectfully submitted,</p>
          <svg className="w-36 h-9 text-zinc-900" viewBox="0 0 160 40" fill="none">
            <path d="M15 25 C30 10, 40 35, 65 15 C85 5, 110 30, 145 15" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <div className="font-bold text-zinc-900 text-xs font-sans">
            {dossier.lorContent?.recommenderName || 'Dr. Rajeshwar Rao'}
          </div>
          <div className="text-[10px] text-zinc-500 font-sans">
            {dossier.lorContent?.designation || 'Senior Research Director & Chair'}
          </div>
          <div className="text-[9px] text-zinc-400 font-sans">
            {dossier.lorContent?.department || 'Department of Artificial Intelligence Lab'}
          </div>
        </div>

        {/* Navy Blue Lab Stamp */}
        <div className="h-18 w-18 rounded-full border-2 border-indigo-900/70 bg-indigo-50/70 p-1 flex flex-col items-center justify-center text-center text-indigo-950 shadow-inner">
          <div className="h-14 w-14 rounded-full border border-dashed border-indigo-700/50 flex flex-col items-center justify-center">
            <span className="text-[7px] font-bold uppercase">AI LAB SEAL</span>
            <span className="text-[6px] font-mono">NIHS &bull; 2024</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Template 4: Identity Verification & Student Passport (Photo, Guilloché, MRZ Strip)
  const renderIDCard = () => (
    <div className="h-full flex flex-col justify-between relative z-10">
      {/* Top Smart ID Banner */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-sm shadow-sm font-bold">
            🪪
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-950">
              {dossier.institution}
            </h2>
            <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">
              International Student Identity &amp; Travel Credential
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-300 text-[10px] font-mono font-bold text-zinc-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          ACTIVE CHIP
        </div>
      </div>

      {/* Photo & Biometric Details Grid */}
      <div className="grid grid-cols-12 gap-5 my-4 items-center">
        {/* Biometric Portrait Photo with Security Guilloché Border */}
        <div className="col-span-4 relative group">
          <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-zinc-900 bg-zinc-200 shadow-md relative">
            <img
              src={dossier.idCardData?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
              alt="Candidate Biometric"
              className="w-full h-full object-cover"
            />
            {/* Holographic Watermark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/20 to-indigo-500/20 pointer-events-none mix-blend-overlay" />
            <div className="absolute bottom-0 inset-x-0 bg-zinc-900/80 text-[8px] font-mono text-white text-center py-0.5">
              BIOMETRIC VERIFIED
            </div>
          </div>
        </div>

        {/* Attributes Grid */}
        <div className="col-span-8 space-y-2 text-left">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[9px] text-zinc-400 uppercase font-mono block">Full Name</span>
              <span className="font-serif text-base font-bold text-zinc-950">{dossier.candidateName}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 uppercase font-mono block">Student ID</span>
              <span className="font-mono font-bold text-zinc-900">{dossier.certificateNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            <div>
              <span className="text-[9px] text-zinc-400 uppercase font-mono block">Date of Birth</span>
              <span className="font-mono font-semibold text-zinc-800">{dossier.idCardData?.dob || '14-MAR-2002'}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 uppercase font-mono block">Nationality</span>
              <span className="font-mono font-semibold text-zinc-800">{dossier.idCardData?.nationality || 'IND'}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 uppercase font-mono block">Expires</span>
              <span className="font-mono font-semibold text-emerald-700">{dossier.idCardData?.expiry || '30-JUN-2027'}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-zinc-200">
            <div>
              <span className="text-[8px] text-zinc-400 uppercase font-mono block">Issuing Authority</span>
              <span className="text-[10px] font-bold text-zinc-700">Office of Global Security</span>
            </div>
            {/* Hologram Emblem */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-300 via-rose-300 to-indigo-400 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-zinc-900">
              ✨
            </div>
          </div>
        </div>
      </div>

      {/* ICAO Doc 9303 Optical MRZ Barcode Strip */}
      <div className="bg-zinc-950 text-emerald-400 font-mono text-[11px] p-2.5 rounded-lg border border-zinc-800 tracking-[0.25em] shadow-inner text-left overflow-x-auto leading-relaxed">
        <div>{dossier.idCardData?.mrz?.split('\n')[0] || 'P<IND<<PATEL<<PRIYA<<<<<<<<<<<<<<<<<<<<<<<<<<<'}</div>
        <div>{dossier.idCardData?.mrz?.split('\n')[1] || 'STU9920198IND0203144F2706305<<<<<<<<<<<<<<<<06'}</div>
      </div>
    </div>
  );

  // Render Template 5: Enrollment & Degree Candidacy Letter
  const renderEnrollmentLetter = () => (
    <div className="h-full flex flex-col justify-between relative z-10 text-left">
      {/* Letterhead */}
      <div className="border-b-2 border-zinc-900 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center text-xl shadow-sm">
            🎓
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-zinc-950">
              {dossier.institution}
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Office of the Provost &bull; Verification of Matriculation &amp; Candidacy
            </p>
          </div>
        </div>
        <div className="text-right font-mono text-[10px] text-zinc-500">
          <div>Ref: <strong className="text-zinc-900">{dossier.certificateNumber}</strong></div>
          <div>Date: <strong>{dossier.dateOfIssue}</strong></div>
        </div>
      </div>

      {/* Candidacy Body */}
      <div className="my-4 space-y-3.5 text-zinc-800 text-xs md:text-sm">
        <div className="p-3 bg-zinc-100/90 rounded-xl border border-zinc-200">
          <span className="text-[9px] uppercase font-mono text-zinc-500 block">Certificate of Good Standing</span>
          <p className="font-serif text-base font-bold text-zinc-950 pt-0.5">
            This is to certify that <span className="underline decoration-amber-500 underline-offset-4">{dossier.candidateName}</span> is a fully matriculated doctoral scholar.
          </p>
        </div>

        <p className="text-zinc-700 leading-relaxed font-sans text-xs md:text-[13px]">
          The scholar is enrolled in the <strong>{dossier.degree}</strong> and has successfully completed all comprehensive qualifying examinations. The candidate remains in exemplary academic and financial standing with full departmental fellowship support.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-mono">
          <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="text-[9px] text-zinc-400 block">Registration Code</span>
            <span className="font-bold text-zinc-900">{dossier.registrationNumber}</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="text-[9px] text-zinc-400 block">Expected Defense</span>
            <span className="font-bold text-zinc-900">May 2026</span>
          </div>
        </div>
      </div>

      {/* Signoff */}
      <div className="flex items-end justify-between pt-3 border-t border-zinc-200">
        <div>
          <svg className="w-32 h-8 text-zinc-900" viewBox="0 0 160 40" fill="none">
            <path d="M10 25 C25 5, 45 35, 75 12 C95 2, 120 28, 150 15" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <div className="font-serif font-bold text-xs text-zinc-900">Dr. Sarah Lin</div>
          <div className="text-[9px] text-zinc-500">Provost &amp; Vice Chancellor of Academic Affairs</div>
        </div>

        <div className="h-16 w-16 rounded-full border-2 border-amber-600/80 bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center text-center text-amber-900 shadow-sm">
          <span className="text-[7px] font-bold uppercase">PROVOST</span>
          <span className="text-[6px] font-mono">SEAL &bull; 2024</span>
        </div>
      </div>
    </div>
  );

  // Render Template 6: Research Fellowship Award (Bronze/Emerald Frame, Laurel, Grant)
  const renderFellowshipAward = () => (
    <div className="h-full flex flex-col justify-between relative z-10 text-center">
      {/* Ornate Bronze Frame Accent */}
      <div className="absolute inset-2 border-2 border-emerald-900/15 rounded-sm pointer-events-none" />
      <div className="absolute inset-3 border border-amber-900/10 rounded-sm pointer-events-none" />

      {/* Header */}
      <div className="space-y-1 relative z-10 pt-2">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 via-amber-100 to-amber-200 border border-emerald-600/40 text-xl shadow-sm mb-1">
          🏆
        </div>
        <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-zinc-950">
          {dossier.institution}
        </h2>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-900/80 font-bold">
          Distinguished Postdoctoral Fellowship Award
        </p>
      </div>

      {/* Inscription */}
      <div className="space-y-3 my-3 relative z-10">
        <p className="font-serif italic text-xs text-zinc-600">The Board of Fellows hereby confers upon</p>
        <div className="font-serif text-3xl font-bold text-zinc-950 border-b border-zinc-300 pb-2 mx-10">
          {dossier.candidateName}
        </div>
        <p className="font-serif text-sm font-semibold text-zinc-800">
          {dossier.degree}
        </p>
        <div className="font-mono text-[10px] text-zinc-500">
          Tenure: <strong>2023 &ndash; 2024</strong> &bull; Grant Reference: <strong>GR-GISE-99182</strong>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-3 border-t border-zinc-200 relative z-10">
        <div className="text-left space-y-0.5 w-40">
          <svg className="w-28 h-7 text-zinc-900" viewBox="0 0 160 40" fill="none">
            <path d="M10 25 C35 15, 60 30, 90 10 C120 20, 140 10, 155 25" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="font-serif text-xs font-bold text-zinc-900">Prof. Marcus Vance</div>
          <div className="text-[9px] text-zinc-500">Dean of Research Excellence</div>
        </div>

        {/* Bronze Wax Seal */}
        <div className="h-18 w-18 rounded-full border-2 border-dashed border-amber-800/80 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 shadow-md flex flex-col items-center justify-center text-amber-950">
          <span className="text-[8px] font-bold uppercase">GISE SEAL</span>
          <span className="text-[6px] font-mono">FELLOWSHIP 2024</span>
        </div>

        <div className="text-right space-y-0.5 w-40">
          <div className="font-mono text-xs font-semibold text-zinc-900">{dossier.dateOfIssue}</div>
          <div className="text-[9px] text-zinc-500 uppercase">Conferral Date</div>
          <div className="text-[9px] font-mono text-zinc-400">{dossier.certificateNumber}</div>
        </div>
      </div>
    </div>
  );

  // Selector for Document Visual Template
  const renderDocumentBody = () => {
    switch (dossier.documentType) {
      case 'Official Academic Transcript':
        return renderTranscript();
      case 'Letter of Recommendation (LOR)':
        return renderLOR();
      case 'Identity Verification & Student Passport':
        return renderIDCard();
      case 'Enrollment & Candidacy Verification':
        return renderEnrollmentLetter();
      case 'Research Fellowship Award':
        return renderFellowshipAward();
      case 'Academic Degree Certificate':
      default:
        return renderCertificate();
    }
  };

  return (
    <div className="depth-card-static rounded-3xl overflow-hidden flex flex-col transition-all duration-300">
      {/* Top Canvas Bar with Frosted Layer Switchers */}
      <div className="border-b border-zinc-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-zinc-50/90 via-white to-zinc-50/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-950">Optical Inspection Stage</span>
            <span className="font-mono text-[10px] text-zinc-400 ml-1.5 font-normal">({dossier.resolution})</span>
          </div>
        </div>

        {/* Zoom & Fit Controls with Inset Capsule */}
        <div className="flex items-center gap-1 bg-zinc-100/90 rounded-full p-1 border border-zinc-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-white transition-all cursor-pointer shadow-none hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[11px] font-semibold text-zinc-700 px-2 min-w-[42px] text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-white transition-all cursor-pointer shadow-none hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-white transition-all ml-0.5 border-l border-zinc-200/80 cursor-pointer shadow-none hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            title="Reset Fit (100%)"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Layer Switcher Tabs with Dimensional Inset Depth */}
      <div className="border-b border-zinc-200/70 px-6 py-2.5 flex items-center gap-2 bg-[#FAF8F5]/90 overflow-x-auto">
        <button
          onClick={() => onLayerChange(1)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeLayer === 1
              ? 'depth-pill-active'
              : 'depth-pill-inactive border border-transparent hover:border-zinc-200/80'
          }`}
        >
          <KbdBadge kbd="1" />
          <span>Pristine Scan</span>
        </button>

        <button
          onClick={() => onLayerChange(2)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeLayer === 2
              ? 'depth-pill-active'
              : 'depth-pill-inactive border border-transparent hover:border-zinc-200/80'
          }`}
        >
          <KbdBadge kbd="2" />
          <span>Tampering Heatmap</span>
          {numAnomalies > 0 ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              {numAnomalies} Flagged
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Clean
            </span>
          )}
        </button>

        <button
          onClick={() => onLayerChange(3)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeLayer === 3
              ? 'depth-pill-active'
              : 'depth-pill-inactive border border-transparent hover:border-zinc-200/80'
          }`}
        >
          <KbdBadge kbd="3" />
          <span>OCR Anchors</span>
        </button>

        <button
          onClick={() => onLayerChange(4)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeLayer === 4
              ? 'depth-pill-active'
              : 'depth-pill-inactive border border-transparent hover:border-zinc-200/80'
          }`}
        >
          <KbdBadge kbd="4" />
          <span>2.5x Loupe &amp; ELA</span>
        </button>
      </div>

      {/* Main Recessed Inspection Mat Viewport with Ambient Lighting */}
      <div className="p-8 md:p-12 bg-mat-gradient shadow-[inset_0_4px_28px_rgba(28,25,23,0.08)] flex items-center justify-center min-h-[540px] overflow-auto relative">
        {/* Subtle Archival Light Ring Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.7)_0%,transparent_70%)] pointer-events-none" />

        {activeLayer === 4 ? (
          <div className="w-full relative z-10">
            <ForensicLoupe dossier={dossier} />
          </div>
        ) : (
          /* Multi-Layer Physical Certificate / Document with Depth Shadows & Bevels */
          <div
            className="relative transition-transform duration-300 ease-out origin-center depth-paper text-zinc-900 rounded-sm p-8 md:p-10 border border-[#E2DAD0] w-[680px] min-h-[490px] flex flex-col justify-between select-none z-10"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Dynamic Specialized Document Layout */}
            {renderDocumentBody()}

            {/* Layer 2: Tampering Heatmap Overlay with Luminous Pulse */}
            {activeLayer === 2 && (
              <div className="absolute inset-0 pointer-events-none rounded-sm bg-zinc-950/15 backdrop-blur-[0.5px] z-20">
                {dossier.suspiciousBboxes.map((box, idx) => (
                  <div
                    key={idx}
                    className="absolute border-2 border-rose-500 bg-rose-500/30 flex items-start justify-start p-1.5 rounded-sm shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse"
                    style={{
                      left: `${(box.x1 / 1000) * 100}%`,
                      top: `${(box.y1 / 700) * 100}%`,
                      width: `${((box.x2 - box.x1) / 1000) * 100}%`,
                      height: `${((box.y2 - box.y1) / 700) * 100}%`,
                    }}
                  >
                    <span className="text-[9px] font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded shadow-sm border border-rose-400/50 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 inline" /> {box.label || 'SPLICED ZONE'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Layer 3: OCR Spatial Bounding Boxes Overlay with Interactive Hover */}
            {activeLayer === 3 && (
              <div className="absolute inset-0 pointer-events-auto rounded-sm z-20">
                {dossier.ocrBboxes.map((box, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBox(box.label || `Box ${idx}`)}
                    onMouseLeave={() => setHoveredBox(null)}
                    className="absolute border border-indigo-500/70 bg-indigo-500/10 hover:bg-indigo-500/30 hover:border-indigo-600 transition-all cursor-pointer group rounded-xs shadow-sm"
                    style={{
                      left: `${(box.x1 / 1000) * 100}%`,
                      top: `${(box.y1 / 700) * 100}%`,
                      width: `${((box.x2 - box.x1) / 1000) * 100}%`,
                      height: `${((box.y2 - box.y1) / 700) * 100}%`,
                    }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-0 text-[10px] font-mono bg-zinc-900 text-white px-2 py-0.5 rounded-md shadow-lg z-30 whitespace-nowrap border border-zinc-700 pointer-events-none transition-opacity">
                      {box.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Context Banner */}
      <div className="border-t border-zinc-200/80 px-6 py-3 bg-gradient-to-r from-zinc-50/90 via-white to-zinc-50/90 flex items-center justify-between text-xs text-zinc-500">
        <div>
          {numAnomalies > 0 ? (
            <span className="text-rose-800 font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              <strong>Tampering Anomaly:</strong> {dossier.criticalAnomalies[0]}
            </span>
          ) : (
            <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <strong>Pristine Inspection:</strong> Document structure conforms to verified institutional baseline.
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-zinc-400">
          SHA-256: {dossier.sha256.slice(0, 16)}...
        </span>
      </div>
    </div>
  );
};
