import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <button>
      <Link href="/login/teacher">Login as Teacher</Link>
      </button>
      <button>
      <Link href="/login/student">Login as Student</Link>
      </button>
    </div>
  );
}
