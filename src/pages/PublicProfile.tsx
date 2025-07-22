import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient, Hackathon, User } from "../lib/api";
import { toast } from "@/components/ui/use-toast";
import { Github, Linkedin, Clipboard } from "lucide-react";

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      apiClient
        .getPublicProfile(username)
        .then((res) => {
          const userData = res.user;
          const hackathonData = res.hackathons || [];

          if (userData && userData.username) {
            setUser(userData);
            setHackathons(hackathonData);
            setError(null);
          } else {
            setUser(null);
            setHackathons([]);
            setError("User not found.");
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
          setUser(null);
          setHackathons([]);
          setError("Something went wrong.");
        })
        .finally(() => setLoading(false));
    }
  }, [username]);

  const copyProfileLink = () => {
    const link = `${window.location.origin}/profile/${username}/full`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied!", description: "Your profile link is now in clipboard" });
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!user) return <div className="p-6 text-red-500">User not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-purple-600">{user.username}'s Public Profile</h2>
          <p className="text-gray-600 text-sm mt-1">Email: {user.email}</p>
          <p className="text-gray-700 text-sm mt-2">
            📝 Bio: {user.bio ? user.bio : "This user hasn't written a bio yet."}
          </p>

          <div className="flex gap-3 mt-3">
            {user.githubLink && (
              <a
                href={user.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1 rounded bg-black text-white flex items-center gap-1"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {user.linkedinLink && (
              <a
                href={user.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1 rounded bg-blue-700 text-white flex items-center gap-1"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>

        <button
          onClick={copyProfileLink}
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm px-4 py-2 rounded border border-muted-foreground hover:bg-muted transition"
        >
          <Clipboard className="w-4 h-4" /> Copy Profile Link
        </button>
      </div>

      {/* Hackathon Submissions */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-purple-700">Hackathon Submissions:</h3>
        {hackathons.length === 0 ? (
          <p className="text-gray-500">No hackathons found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {hackathons.map((hack) => {
              const normalizedTechStack = Array.isArray(hack.techStack)
                ? hack.techStack
                : typeof hack.techStack === "string"
                ? hack.techStack.split(",").map((t) => t.trim())
                : [];

              return (
                <div key={hack._id} className="border border-border rounded-lg shadow-sm bg-white p-4 space-y-2">
                  <h4 className="text-lg font-bold text-indigo-600">{hack.hackName}</h4>

                  {hack.organization && (
                    <p className="text-sm text-gray-700">🏢 {hack.organization}</p>
                  )}

                  {hack.status && (
                    <p className="text-sm text-muted-foreground">📌 Status: {hack.status}</p>
                  )}

                  {hack.description && (
                    <p className="text-sm text-gray-600">📝 {hack.description}</p>
                  )}

                  {normalizedTechStack.length > 0 && (
                    <p className="text-sm text-gray-600">
                      🛠️ Tech Used: {normalizedTechStack.join(", ")}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {hack.githubLink && (
                      <a
                        href={hack.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded bg-gray-900 text-white hover:opacity-80 transition"
                      >
                        🐙 GitHub
                      </a>
                    )}

                    {hack.projectLink && (
                      <a
                        href={hack.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:opacity-80 transition"
                      >
                        🚀 Project
                      </a>
                    )}

                    {hack.certificateUrl && (
                      <a
                        href={hack.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:opacity-80 transition"
                      >
                        🎓 Certificate
                      </a>
                    )}
                  </div>

                  {/* Optional dates */}
                  <div className="text-xs text-muted-foreground pt-1">
                    {hack.appliedDate && <p>📅 Applied on: {new Date(hack.appliedDate).toLocaleDateString()}</p>}
                    {hack.lastDateToApply && <p>🕒 Deadline: {new Date(hack.lastDateToApply).toLocaleDateString()}</p>}
                    {hack.lastDateToSubmit && <p>📤 Submission: {new Date(hack.lastDateToSubmit).toLocaleDateString()}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
