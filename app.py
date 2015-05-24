#encoding: utf-8
#-*- coding: utf-8 -*-

from flask import Flask, session, render_template, redirect, url_for, request, jsonify
import json
from json import dumps
import datetime
import urllib2
from urllib2 import Request, urlopen, HTTPError

app = Flask(__name__)
app.secret_key = 'toNieJaBylamEwa'

from werkzeug.debug import DebuggedApplication
app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)
app.debug = True

prefix = '/~parzysm1/apps/client1'
appurl = 'http://len.iem.pw.edu.pl/~parzysm1/apps/noteapp'
 
@app.route(prefix)
def index():
	return render_template('index.html')

@app.route(prefix + '/mainbox', methods=['GET'] )
def mainbox():

	request = Request(appurl)
	response_body = urlopen(request).read()
	notes = json.loads(response_body)
	print notes['notes']
	return jsonify(result=notes['notes'])

@app.route(prefix + '/tag', methods=['GET'] )
def tag():
	note_tag = request.args.get('note_tag',0,type=str)
	print "notetag" + note_tag
	req = Request(appurl + "/tag/" + note_tag)
	response_body = urlopen(req).read()
	notes = json.loads(response_body)
	
	return jsonify(result=notes['notes'])

@app.route(prefix + '/category', methods=['GET'] )
def category():
	note_category = request.args.get('note_category',0,type=str)
	print "notecategory " + note_category
	req = Request(appurl + "/category/" + note_category)
	response_body = urlopen(req).read()
	notes = json.loads(response_body)
	
	return jsonify(result=notes['notes'])

@app.route(prefix + '/delete_note')
def delete_note():
	try:
		note_id = request.args.get('note_id',0,type=int)

		req = Request(appurl + '/note/' + str(note_id))
		req.get_method = lambda: 'DELETE'
		response_body = urlopen(req).read()
		return jsonify(result='Usunięto notatkę')
	except HTTPError:
		return jsonify(result='Notatka nie może zostać usunięta')


@app.route(prefix + '/show_note' , methods=['GET'])
def show_note():
	try:
		note_id = request.args.get('note_id', 0, type=int)
		req = Request(appurl + '/note/' + str(note_id))
		response_body = urlopen(req).read()
		result = json.loads(response_body)
		result = result['note']
		return jsonify(result=result, note_id=note_id)
	except HTTPError:
		return render_template('login.html', message="Blad serwera sprobuj pozniej")


@app.route(prefix + '/new_note', methods=['POST'])
def new_note():
	
	try:
		title = request.form['title']
		category = request.form['category']
		tag = request.form['tag']
		#print str(tag) + "  " + str(category)
		description = request.form['content']
		values = dumps({"category": category, "tag": tag, "title": title, "description": description})
		headers = {"Content-Type": "application/json"}
		
		req = Request(appurl + '/note', data=values, headers=headers)
		response_body = urlopen(req).read()
		print "dzialaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
		return redirect(url_for('index'))	
	except HTTPError:
		return render_template('login.html', message="Błąd serwera spróbuj później")

@app.route(prefix + '/edit_note', methods=['POST'])
def edit_note():
	note_id = request.args.get('note_id', 0, type=int)
	try:
		title = request.form['title']
		category = request.form['category']
		tag = request.form['tag']
		print str(tag) + "  " + str(category)
		description = request.form['content']
		values = dumps({"category": category, "tag": tag, "title": title, "description": description})
		headers = {"Content-Type": "application/json"}
		req = Request(appurl + '/note/' + str(note_id), data=values, headers=headers)
		response_body = urlopen(req).read()
		print "dzialaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
		return redirect(url_for('index'))	
	except HTTPError:
		return render_template('login.html', message="Błąd serwera spróbuj później")
#def message_read(id):
#	request = Request(appurl + "/msg/" + id + "/read")
#	response_body = urlopen(request).read()
#	resp = json.loads(response_body)
#	message = resp['msg']
#	return redirect(url_for'mail')