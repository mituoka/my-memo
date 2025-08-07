import EditMemoClient from './EditMemoClient';

// 静的エクスポート用
export async function generateStaticParams() {
  return [];
}

export default function EditMemo({ params }: { params: { id: string } }) {
  return <EditMemoClient params={params} />;
}