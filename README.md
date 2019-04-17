# recycleIt
 Samsung Bixby Hachathon Project


# Objective
The objective is to create a Bixby capsule that would provide recycling data about an object defined via camera, voice, or image gallery.

The capsule operates in following steps:

1. It takes an inquiry as to whether an object can be recycled
2. Responds to the inquiry with an answer displayed on the screen and/or additional details that can be relevant to the object (e.g. type of batteries that are recyclable)
3. Provides coordinates of nearby locations where this object can be dropped off for recycling
 
An inquiry can be done in three different ways:
1. Verbal inquiry (e.g. “Bixby, can I recycle batteries?”)
2. Verbal command to select a picture and a verbal inquiry about an object on the picture (e.g. “Bixby, let me choose picture from my gallery; can I recycle this?”)
3. Verbal command to take a picture of an object and a verbal inquiry about this object (e.g. “Bixby, take a picture; can I recycle this?”)
 
# API's
 We used:
  -  Google vision api to handle image recognition
  -  Pixabay api for getting a relevant image
  -  Earth911 api to get most of the information about material, recycling locations and recycling items
  -  Camera simulator 
 
 
# Team
 - Yuriy Nenakhov
 - Mariia Pashynska
 - Johnny Tahirov
