const Controller = require("./../controller");
const Course = require("app/model/Course");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class CourseController extends Controller {
  async index(req, res) {
    const page = req.query.page || 1;
    const courses = await Course.paginate({}, {page, limit: 2, sort: {createdAt: 1}});
    res.render("admin/courses/index", {title: "دوره ها", courses});
  }

  creat(req, res) {
    res.render("admin/courses/creat");
  }

  async destroy(req, res) {
    const course = await Course.findOne({_id: req.params.id});
    if(!course)
      res.end("invalid course id");

    //delete image
    Object.values(course.images).forEach(image => {fs.unlinkSync("public" + image)});

    //delete course
    course.remove();

    //send respond
    res.redirect("/admin/courses");
  }

  async edit(req, res) {
    try {
      this.isMongoId(req.params.id);

      const course = await Course.findOne({_id: req.params.id});
      res.render("admin/courses/edit", {title: "ویرایش دوره", course});
    } catch (err) {
      next(err); 
    }
  }

  async update(req, res) {
    const result = await this.validateData(req);
    if(!result) {
      if(req.file)
        fs.unlinkSync(req.file.path);
      this.back(req, res);
    }

    const course = await Course.findById(req.params.id);
    delete req.body.images;
    const newCourse = {}; 
    newCourse.slug = this.slug(req.body.title);
    if(req.file){
      Object.values(course.images).forEach(image => {fs.unlinkSync("public" + image)});
      newCourse.images = await this.imageResize(req.file);
      newCourse.thumbnail = newCourse.images[480];
    }
    await Course.findOneAndUpdate(req.params.id, {$set: {...req.body, ...newCourse }}, {useFindAndModify: false});
    return res.redirect("/admin/courses");
  }

  // Validate and Save course to the database
  async store(req, res) {
    const result = await this.validateData(req);
    if(!result) {
      if(req.file)
        fs.unlinkSync(req.file.path);
      return this.back(req, res);
    }

    const images = this.imageResize(req.file);
    const { title , body , type , price , tags } = req.body;

    const newCourse = new Course({
      user: req.user._id,
      title,
      body,
      slug: this.slug(title),
      type,
      price,
      tags,
      images,
      thumbnail: images["420"],
    }); 

    await newCourse.save();
    return res.redirect("/admin/courses");
  }

  // Make a valid url
  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
  }

  // Resize the uploaded picture
  imageResize(image) {
    // Image url object
    const imageInfo = path.parse(image.path);

    const imagesAddress = {}; // All of the pictures address
    imagesAddress["original"] = this.getImagePath("./" + image.path);

    // All of the resulotions
    [1080, 720, 420].map((size) => {
    const imageName = `${imageInfo.name}-${size}${imageInfo.ext}`; // Name of the resized image
    imagesAddress[size] = this.getImagePath(`${image.destination}/${imageName}`);
    sharp(image.path)
      .resize(size, null)
      .toFile(`${image.destination}/${imageName}`)
    });

    return imagesAddress;
  }

  // Return the path from public folder
  getImagePath(path) {
    return path.substring(8);
  }
}

module.exports = new CourseController();