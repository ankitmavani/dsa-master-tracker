import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  CalendarDays,
  Plus,
  X,
  PlayCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { roadmapApi } from "@/services/roadmap.service";
import { dayApi } from "@/services/day.service";
import type { Roadmap } from "@/types/roadmap";
import { v4 as uuid } from "uuid";

interface Day {
  id: string;
  day: number;
  title: string;
}

// interface Roadmap {
//   id: string;
//   title: string;
//   description: string;
//   totalDays: number;
//   type: string;
// }

export default function LearningRoadmapPage() {
  const navigate = useNavigate();
  const { roadmapId = "" } = useParams();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [days, setDays] = useState<Day[]>([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [dayTitle, setDayTitle] = useState("");
  const [tab, setTab] = useState<"roadmap" | "youtube" | "books" | "notes">(
    "roadmap",
  );

  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const [playlist, setPlaylist] = useState({
    title: "",
    url: "",
    thumbnail: "",
    channel: "",
  });

  const [book, setBook] = useState({
    title: "",
    url: "",
    cover: "",
    author: "",
  });

  const [note, setNote] = useState({
    title: "",
    content: "",
    links: "",
  });

  const fetchRoadmap = async () => {
    try {
      setLoading(true);

      const res = await roadmapApi.getById(roadmapId);

      setRoadmap(res.data.roadmap);
      setDays(res.data.days);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [roadmapId]);

  const handleAddDay = async () => {
    if (!dayTitle.trim()) return;

    await dayApi.create({
      roadmapId,
      title: dayTitle,
    });

    setDayTitle("");
    setOpen(false);

    fetchRoadmap();
  };

  const handleAddPlaylist = async () => {
    if (
      !playlist.title.trim() ||
      !playlist.url.trim() ||
      !playlist.thumbnail.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await roadmapApi.addPlaylist(roadmapId, {
        id: uuid(),
        title: playlist.title,
        url: playlist.url,
        thumbnail: playlist.thumbnail,
        channel: playlist.channel,
      });

      setPlaylist({
        title: "",
        url: "",
        thumbnail: "",
        channel: "",
      });

      setPlaylistOpen(false);
      fetchRoadmap();
    } catch (err) {
      console.error(err);
      alert("Failed to add playlist");
    }
  };

  const handleAddBook = async () => {
    if (!book.title.trim() || !book.url.trim()) {
      alert("Please fill required fields");
      return;
    }

    try {
      await roadmapApi.addBook(roadmapId, {
        id: uuid(),
        title: book.title,
        url: book.url,
        cover: book.cover,
        author: book.author,
      });

      setBook({
        title: "",
        url: "",
        cover: "",
        author: "",
      });

      setBookOpen(false);
      fetchRoadmap();
    } catch (err) {
      console.error(err);
      alert("Failed to add book");
    }
  };

  const handleAddNote = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      alert("Please fill required fields");
      return;
    }

    try {
      const links = note.links
        .split("\n")
        .map((link) => link.trim())
        .filter(Boolean);

      await roadmapApi.addNote(roadmapId, {
        id: uuid(),
        title: note.title,
        content: note.content,
        links,
      });

      setNote({
        title: "",
        content: "",
        links: "",
      });

      setNoteOpen(false);
      fetchRoadmap();
    } catch (err) {
      console.error(err);
      alert("Failed to add note");
    }
  };

  const progress = useMemo(() => {
    if (!roadmap) return 0;
    return (days.length / roadmap.totalDays) * 100;
  }, [days, roadmap]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roadmap) {
    return <div>Roadmap not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        className="neo-button flex items-center gap-2 bg-white px-4 py-2"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* HERO */}
      <section className="neo-card bg-green p-6">
        <span className="rounded-lg border-[3px] border-black bg-white px-3 py-1 text-xs font-bold">
          LEARNING ROADMAP
        </span>

        <h1 className="font-heading mt-4 text-5xl font-bold">
          {roadmap.title}
        </h1>

        <p className="mt-2">{roadmap.description}</p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>Progress</span>

            <span>
              {days.length}/{roadmap.totalDays} Days
            </span>
          </div>

          <div className="h-4 rounded-full border-[3px] border-black bg-white">
            <div
              className="h-full rounded-full bg-black"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="neo-card bg-yellow p-4">
          <CalendarDays size={22} />
          <p className="mt-2 text-xs font-semibold">Total Days</p>
          <h2 className="font-heading text-3xl font-bold">
            {roadmap.totalDays}
          </h2>
        </div>

        <div className="neo-card bg-green p-4">
          <CheckCircle2 size={22} />
          <p className="mt-2 text-xs font-semibold">Created</p>
          <h2 className="font-heading text-3xl font-bold">{days.length}</h2>
        </div>

        <div className="neo-card bg-pink p-4">
          <RotateCcw size={22} />
          <p className="mt-2 text-xs font-semibold">Remaining</p>
          <h2 className="font-heading text-3xl font-bold">
            {roadmap.totalDays - days.length}
          </h2>
        </div>

        <div className="neo-card bg-blue p-4">
          <BookOpen size={22} />
          <p className="mt-2 text-xs font-semibold">Progress</p>
          <h2 className="font-heading text-3xl font-bold">
            {Math.round(progress)}%
          </h2>
        </div>
      </div>

      <div className="mb-0 flex gap-3 overflow-x-auto pb-5">
        {[
          ["roadmap", "Roadmap"],
          ["youtube", "YouTube"],
          ["books", "Books"],
          ["notes", "Notes"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`neo-button px-5 py-3 whitespace-nowrap ${
              tab === key ? "bg-black text-white" : "bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* DAYS */}
      {tab === "roadmap" && (
        <section className="mt-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold">All Days</h2>

            <button
              onClick={() => setOpen(true)}
              className="neo-button bg-black px-4 py-2 text-white"
            >
              <div className="flex items-center gap-2">
                <Plus size={16} />
                Add Day
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() =>
                  navigate(`/learning/${roadmapId}/day/${day.day}`)
                }
                className="neo-card bg-white p-4 text-left transition hover:-translate-y-1"
              >
                <div className="mb-3 flex justify-between">
                  <span className="bg-yellow rounded-lg border-[3px] border-black px-3 py-1 font-bold">
                    {String(day.day).padStart(2, "0")}
                  </span>
                  📚
                </div>

                <h3 className="font-heading font-bold">Day {day.day}</h3>

                <p className="mt-1 text-sm opacity-70">{day.title}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {tab === "youtube" && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold">
              YouTube Playlist
            </h2>

            <button
              onClick={() => setPlaylistOpen(true)}
              className="neo-button bg-black px-4 py-2 text-white"
            >
              + Add Playlist
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {roadmap.youtubePlaylists?.map((item) => (
              <div key={item.id} className="neo-card bg-white p-3">
                <img
                  src={item.thumbnail}
                  className="h-44 w-full rounded-xl border-[3px] border-black object-cover"
                />

                <h3 className="mt-3 text-xl font-black">{item.title}</h3>

                <p className="text-sm opacity-70">{item.channel}</p>

                <a
                  href={item.url}
                  target="_blank"
                  className="neo-button bg-red mt-4 block py-2 text-center text-white"
                >
                  ▶ Open Playlist
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "books" && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold">Books</h2>

            <button
              onClick={() => setBookOpen(true)}
              className="neo-button bg-black px-4 py-2 text-white"
            >
              + Add Book
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {roadmap.books?.map((book) => (
              <div key={book.id} className="neo-card bg-white p-4">
                <img
                  src={book.cover}
                  className="h-48 w-full rounded-xl border-[3px] border-black object-cover"
                />

                <h3 className="mt-3 text-xl font-black">{book.title}</h3>

                <p className="text-sm opacity-70">{book.author}</p>

                <a
                  href={book.url}
                  target="_blank"
                  className="neo-button bg-blue mt-4 block py-2 text-center text-white"
                >
                  📖 Open PDF
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "notes" && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold">Notes</h2>

            <button
              onClick={() => setNoteOpen(true)}
              className="neo-button bg-black px-4 py-2 text-white"
            >
              + Add Note
            </button>
          </div>

          <div className="space-y-4">
            {roadmap.notes?.map((note) => (
              <div key={note.id} className="neo-card bg-white p-5">
                <h3 className="text-xl font-black">{note.title}</h3>

                <p className="mt-3 text-sm whitespace-pre-wrap">
                  {note.content}
                </p>

                {note.links?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {note.links.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        className="block font-semibold text-blue-600 underline"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {playlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="neo-card w-full max-w-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-3xl font-black">
                  🎬 Add YouTube Playlist
                </h2>
                <p className="text-sm opacity-70">
                  Add a complete playlist for this roadmap
                </p>
              </div>

              <button
                onClick={() => setPlaylistOpen(false)}
                className="rounded-xl border-[3px] border-black bg-white p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="mb-5 overflow-hidden rounded-2xl border-[3px] border-black bg-zinc-100">
              {playlist.thumbnail ? (
                <img
                  src={playlist.thumbnail}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center">
                  <div className="text-center">
                    <PlayCircle size={54} className="mx-auto" />
                    <p className="mt-3 font-bold">Thumbnail Preview</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-black">Playlist Title</label>
                <input
                  value={playlist.title}
                  onChange={(e) =>
                    setPlaylist({ ...playlist, title: e.target.value })
                  }
                  placeholder="Node.js Complete Course"
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black">Channel Name</label>
                <input
                  value={playlist.channel}
                  onChange={(e) =>
                    setPlaylist({ ...playlist, channel: e.target.value })
                  }
                  placeholder="Codevolution"
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-black">
                  YouTube Playlist URL
                </label>
                <input
                  value={playlist.url}
                  onChange={(e) =>
                    setPlaylist({ ...playlist, url: e.target.value })
                  }
                  placeholder="https://youtube.com/playlist?list=..."
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-black">Thumbnail URL</label>
                <input
                  value={playlist.thumbnail}
                  onChange={(e) =>
                    setPlaylist({
                      ...playlist,
                      thumbnail: e.target.value,
                    })
                  }
                  placeholder="https://i.ytimg.com/..."
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPlaylistOpen(false)}
                className="neo-button bg-white px-5 py-3"
              >
                Cancel
              </button>

              <button
                onClick={handleAddPlaylist}
                className="neo-button bg-red px-6 py-3 text-white"
              >
                ▶ Save Playlist
              </button>
            </div>
          </div>
        </div>
      )}

      {bookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="neo-card w-full max-w-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-3xl font-black">
                  📚 Add Book
                </h2>
                <p className="text-sm opacity-70">
                  Google Drive PDF + Cover Image
                </p>
              </div>

              <button
                onClick={() => setBookOpen(false)}
                className="rounded-xl border-[3px] border-black bg-white p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cover Preview */}
            <div className="mb-5 flex justify-center">
              <div className="h-56 w-40 overflow-hidden rounded-2xl border-[3px] border-black bg-zinc-100">
                {book.cover ? (
                  <img
                    src={book.cover}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <BookOpen size={40} className="mx-auto" />
                      <p className="mt-2 text-xs font-bold">Book Cover</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-black">Book Title</label>
                <input
                  value={book.title}
                  onChange={(e) => setBook({ ...book, title: e.target.value })}
                  placeholder="Node.js Design Patterns"
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black">Author</label>
                <input
                  value={book.author}
                  onChange={(e) => setBook({ ...book, author: e.target.value })}
                  placeholder="Mario Casciaro"
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-black">
                  Google Drive PDF URL
                </label>
                <input
                  value={book.url}
                  onChange={(e) => setBook({ ...book, url: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-black">Cover Image URL</label>
                <input
                  value={book.cover}
                  onChange={(e) => setBook({ ...book, cover: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setBookOpen(false)}
                className="neo-button bg-white px-5 py-3"
              >
                Cancel
              </button>

              <button
                onClick={handleAddBook}
                className="neo-button bg-blue px-6 py-3 text-white"
              >
                📖 Save Book
              </button>
            </div>
          </div>
        </div>
      )}

      {noteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="neo-card w-full max-w-3xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-3xl font-black">
                  📝 Add Resource Note
                </h2>
                <p className="text-sm opacity-70">
                  Store interview notes, articles & useful links
                </p>
              </div>

              <button
                onClick={() => setNoteOpen(false)}
                className="rounded-xl border-[3px] border-black bg-white p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-black">
                  Note Title
                </label>
                <input
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                  placeholder="Node.js Interview Preparation"
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">Content</label>
                <textarea
                  rows={6}
                  value={note.content}
                  onChange={(e) =>
                    setNote({
                      ...note,
                      content: e.target.value,
                    })
                  }
                  placeholder="Write all important concepts..."
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-medium outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Resource Links
                </label>
                <textarea
                  rows={4}
                  value={note.links}
                  onChange={(e) =>
                    setNote({
                      ...note,
                      links: e.target.value,
                    })
                  }
                  placeholder={`One link per line

https://nodejs.org/docs
https://developer.mozilla.org`}
                  className="w-full rounded-xl border-[3px] border-black px-4 py-3 font-medium outline-none"
                />

                <p className="mt-2 text-xs font-semibold opacity-70">
                  Add one URL per line. They will become clickable resources.
                </p>
              </div>

              {/* Preview */}
              <div className="bg-yellow rounded-2xl border-[3px] border-black p-4">
                <p className="text-xs font-black">PREVIEW</p>
                <h3 className="mt-2 text-xl font-black">
                  {note.title || "Note Title"}
                </h3>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {note.content || "Your note preview..."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setNoteOpen(false)}
                className="neo-button bg-white px-5 py-3"
              >
                Cancel
              </button>

              <button
                onClick={handleAddNote}
                className="neo-button bg-black px-6 py-3 text-white"
              >
                💾 Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD DAY MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="neo-card w-full max-w-md bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">Add New Day</h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <label className="text-sm font-bold">Day Title</label>

            <input
              value={dayTitle}
              onChange={(e) => setDayTitle(e.target.value)}
              placeholder="Node.js Basics"
              className="mt-2 w-full rounded-xl border-[3px] border-black px-4 py-3 outline-none"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="neo-button bg-white"
              >
                Cancel
              </button>

              <button
                onClick={handleAddDay}
                className="neo-button bg-black text-white"
              >
                Create Day
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
