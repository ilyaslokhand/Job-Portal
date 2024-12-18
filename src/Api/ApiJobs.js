import superbaseclinet from "@/Utils/Superbase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const superbase = await superbaseclinet(token);

  // Start constructing the query
  let query = superbase
    .from("Jobs")
    .select("*, company:Compaines(name, logo_url), SavedJobs(Jobs(id))");
  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.log("Error Fetching Jobs:", error);
    return [];
  }

  return data;
}

export async function saveJob(token, { alreadySaved }, saveData) {
  const superbase = await superbaseclinet(token);

  if (alreadySaved) {
    const { data, error: DeleteError } = await superbase
      .from("SavedJobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (DeleteError) {
      console.log("Error Deleting Saved Jobs:", DeleteError);
      return data;
    }
    return data;
  } else {
    const { data, error: insertError } = await superbase
      .from("SavedJobs")
      .insert([saveData])
      .select();
    if (insertError) {
      console.log("Error Deleting Saved Jobs:", insertError);
      return data;
    }
    return data;
  }
}

export async function getSingleJob(token, { job_id }) {
  const superbase = await superbaseclinet(token);

  const { data, error } = await superbase
    .from("Jobs")
    .select("*,company:Compaines(name, logo_url), Application: Application(*)")
    .eq("id", job_id)
    .single();

  if (error) {
    console.log("Error fectching Job:", error);
    return null;
  }
  return data;
}

export async function UpdateHiringStatus(token, { job_id }, isOpen) {
  const superbase = await superbaseclinet(token);

  const { data, error } = await superbase
    .from("Jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();
  if (error) {
    console.log("Error Updating Job:", error);
    return null;
  }
  return data;
}

export async function addNewJob(token, _, JobData) {
  const superbase = await superbaseclinet(token);

  // Sanitize JobData
  for (const key in JobData) {
    if (typeof JobData[key] === "string" && JobData[key].trim() === "") {
      JobData[key] = null; // Replace empty strings with null
    }
  }

  const { data, error } = await superbase
    .from("Jobs")
    .insert([JobData])
    .select();

  if (error) {
    console.log("Error Creating Job:", error);
    return null;
  }
  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await superbaseclinet(token);

  console.log("Attempting to delete job with ID:", job_id);

  const { data, error: deleteError } = await supabase
    .from("Jobs") // Correct table name with capital "J"
    .delete()
    .eq("id", parseInt(job_id, 10)) // Ensure ID is the correct type
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    throw new Error(deleteError.message);
  }

  console.log("Delete response data:", data);

  return data;
}
