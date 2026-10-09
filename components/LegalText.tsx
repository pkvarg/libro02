import Header from '@/components/Header'

export interface LegalSection {
  id: string
  title: string
  // A string is a paragraph; an array of strings is a bullet list.
  body: (string | string[])[]
}

interface LegalTextProps {
  label: string
  effective: string
  intro?: string
  sections: LegalSection[]
}

const LegalText = ({ label, effective, intro, sections }: LegalTextProps) => (
  <>
    <Header showBackArrow label={label} />
    <div className="m-4 text-[17px] leading-relaxed text-[#9ca3af] flex flex-col gap-3">
      <p className="text-sm text-neutral-500">{effective}</p>
      {intro && <p>{intro}</p>}
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-4 mt-2">
          <h2 className="text-white text-xl font-semibold mb-2">{section.title}</h2>
          {section.body.map((block, i) =>
            Array.isArray(block) ? (
              <ul key={i} className="list-disc ml-6 mb-2 space-y-1">
                {block.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p key={i} className="mb-2">
                {block}
              </p>
            )
          )}
        </section>
      ))}
    </div>
  </>
)

export default LegalText
