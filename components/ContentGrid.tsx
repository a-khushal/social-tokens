import { Metadata } from "@/app/dashboard/page"
import { ContentCard } from "./ContentCard"

export function TokenContentGrid({ metadata }: {
    metadata: Metadata[]
}) {
    const content = metadata.map((m) => ({
        ...m,
        imageClickUrl: `https://gateway.pinata.cloud/ipfs/${m.ipfsHash}`,
    }));

    console.log(content)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {content.map((c, index) => (
            <ContentCard 
                key={index} 
                content={c}
            />
        ))}
    </div>
  )
}

