from video_api import youtube_search
import json
import os


jobs=[{'title':'Project Management','skills':['PMP','Agile', 'SDLC','Scrum','ITIL Foundation','CAPM','Cisco CCNA','Microsoft Project']},
      {'title':'Backend Programmer','skills':['PHP','Ruby','Python','Java','.Net','MySQL','Oracle','SQL Server','Zend','Symfony','CakePHP','SVN','CVS','Git']},
      {'title':'Data Analyst','skills':['Python','R packages','Descriptive and Inferential Statistics','Multivariable Calculus','Linear algebra','Experimental Design','Supervised and Reinforcement Learning','Database Systems','Interpretation of Data','SPSS','Cognos','SAS','MATLAB']},
      {'title':'Frontend Developer','skills':['HTML','CSS','JavaScript','jQuery','CSS Preprocessing','Git','Responsive Design','Testing and Debugging','Browser Developer Tools','Building and Automation Tools Web Performance','Command Line Interface']},
      {'title':'Graphic Designer','skills':['Typography','Adobe Photoshop','Sketch','Adobe InDesign','Quark','HTML','CSS','Photography','Social Media Marketing']}
    ]
def levenshteinDistance(s1, s2):
    if len(s1) > len(s2):
        s1, s2 = s2, s1

    distances = range(len(s1) + 1)
    for i2, c2 in enumerate(s2):
        distances_ = [i2+1]
        for i1, c1 in enumerate(s1):
            if c1 == c2:
                distances_.append(distances[i1])
            else:
                distances_.append(1 + min((distances[i1], distances[i1 + 1], distances_[-1])))
        distances = distances_
    return distances[-1]


def recommendJobs(mySkills):
    suggestedJobs=[]
    matchCount=[]
    threshold=3
    for job in jobs:
        count=0
        skills=job['skills']
        for skill in skills:
            for mySkill in mySkills:
                distance=levenshteinDistance(mySkill.replace(' ','').lower().strip(), skill.replace(' ','').lower().strip())
                if (distance<=2):
                    count+=1
        if(count>=threshold):   
            suggestedJobs.append(job['title'])
        matchCount.append(count)   
       
    if(max(matchCount)==0):
        for job in jobs:
            suggestedJobs.append(job['title'])
        
    elif(len(suggestedJobs)==0):
        maxValue=max(matchCount)
        indices = [i for i, x in enumerate(matchCount) if x == maxValue]
        for index in indices:
            suggestedJobs.append(jobs[index]['title'])
           

    return suggestedJobs

def recommendVideos(myJob,mySkills,lang):
    requiredSkills=[]
    toLearnSkills=[]
    toLearnSkills.append('Learn '+lang)
    for job in jobs:
        if (job['title']== myJob):
            requiredSkills=job['skills']
    for skill in requiredSkills:
        flag=0
        for mySkill in mySkills:
            distance=levenshteinDistance(mySkill.replace(' ','').lower().strip(), skill.replace(' ','').lower().strip())
            if (distance<=2):
                flag=1
        if (flag==0):
            toLearnSkills.append(skill)
   
    options=dict()
    youtubeResults=[]
    cachedFiles=os.listdir("cache")
    for toLearnSkill in toLearnSkills:
        if toLearnSkill+".json" not in cachedFiles:
            options['term']='Learn '+toLearnSkill
            options['part']='id,snippet'
            options['max_results']=2
            result=youtube_search(options)
            youtubeResults.append(result)
            with open('cache/'+toLearnSkill+".json", 'w') as outfile:
                json.dump(result, outfile)
        else:
             youtubeResults.append(json.load(open('cache/'+toLearnSkill+".json")))

        
    print (youtubeResults)
    return youtubeResults
    
