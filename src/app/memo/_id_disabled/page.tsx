import MemoPageClient from './MemoPageClient';

// 静的エクスポート用
export async function generateStaticParams() {
  return [];
}

export default function MemoPage({ params }: { params: { id: string } }) {
  return <MemoPageClient params={params} />;
}