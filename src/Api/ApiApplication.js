import superbaseclinet, { supabaseUrl } from "@/Utils/Superbase";

export async function ApplyToJob(token, _, jobData) {
  const superbase = await superbaseclinet(token);

  const Random = Math.floor(Math.random() * 90000);
  const Filename = `resumes-${Random}-${jobData.Candidate_id}`;

  const { error: Storageerror } = await superbase.storage
    .from("resumes")
    .upload(Filename, jobData.resumes, {
      cacheControl: "3600",
      upsert: false, // Prevent overwriting existing files
    });

  if (Storageerror) {
    console.log("Error uploading Resumes:", error);
    return null;
  }

  const resumes = `${supabaseUrl}/storage/v1/object/public/resumes/${Filename}`;
  console.log(resumes);

  const { data, error } = await superbase
    .from("Application")
    .insert([
      {
        ...jobData,
        resumes,
      },
    ])
    .select();

  if (error) {
    console.log("Error submiting Application:", error);
    return null;
  }
  return data;
}

export async function updateappliations(token, { job_id }, status) {
  const superbase = await superbaseclinet(token);

  const { data, error } = await superbase
    .from("Application")
    .update({ status })
    .eq("job_id", job_id)
    .select("");

  if (error || data.length == 0) {
    console.log("Error updating application status:", error);
    return null;
  }
  return data;
}
