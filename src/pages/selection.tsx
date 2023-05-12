import Link from 'next/link';

export default function SelectionPage() {
  return (
    <div>
      <Link href="/image_upload"><button>Upload Image</button></Link>
      <Link href="/chat"><button>Chat</button></Link>
    </div>
  );
}
