import EditorLayout from "@/components/EditorLayout";

export default function EditorPage({
  searchParams,
}: {
  searchParams: { topic?: string };
}) {
  return <EditorLayout topic={searchParams.topic} />;
}
